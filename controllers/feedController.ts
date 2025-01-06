import { Request, Response, RequestHandler } from 'express';
import multer from 'multer';
import { getFeedById, saveFeedToDB } from '../services/feedService';
import dotenv from 'dotenv';
import { deleteFromS3, uploadToS3 } from '../util/uplode';
import { Feed } from '../models/feed';
import { parseInputData } from '../util/parseJsonSafely';
import jwt from 'jsonwebtoken';
import { initializeRabbitMQ, sendMsgToQueue } from '../services/producer';
import { User } from '../models/user';
import { Influencer } from '../models/influencer';

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([
  { name: 'productImgs', maxCount: 5 },
  { name: 'postImages', maxCount: 5 },
]);

export const FeedGetById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      res.status(400).json({ message: '유효하지 않은 피드 ID입니다.' });
      res.status(400).json({ message: '유효하지 않은 피드 ID입니다.' });
      return; // 명시적으로 반환
    }

    const feed = await getFeedById(Number(id));
    if (!feed) {
      res.status(404).json({ message: '해당 피드가 없습니다.' });
      res.status(404).json({ message: '해당 피드가 없습니다.' });
      return;
    }

    res.status(200).json(feed); // 응답 후 반환 없음
  } catch (error) {
    console.error('FeedGet Error:', error);
    res.status(500).json({ error: '피드를 가져오는 중 오류가 발생했습니다.' });
  }
};

export const FeedWrite = async (req: Request, res: Response) => {
  upload(req as Request, res as Response, async (err: any) => {
    if (err) {
      return res.status(400).json({ error: '파일 업로드 실패' });
    }

    try {
      const { description, grade, productImgsLink, productImgsTitle } =
        req.body;
      const { productImgs, postImages } = req.files as {
        postImages?: Express.Multer.File[];
        productImgs?: Express.Multer.File[];
      };
      const token = req.headers['authorization'] as string; // 요청 헤더 출력

      // Bearer 부분 제거하고 실제 토큰만 가져오기
      const tokenWithoutBearer = token.split(' ')[1];

      // JWT 디코딩
      const decoded = jwt.verify(
        tokenWithoutBearer,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload;
      const influencerId = decoded.influencerId;

      if (!influencerId) {
        return res.status(400).json({ error: '인플루언서가 아닙니다.' });
      }
      // 필수 파일 체크
      if (!postImages) {
        return res.status(400).json({ error: '필수 파일이 누락되었습니다.' });
      }

      // 파일들을 S3로 업로드하고 URL을 반환받음
      const thumbnailUrls = await Promise.all(
        (postImages as Express.Multer.File[]).map(uploadToS3)
      );

      const productImgUrls = await Promise.all(
        (productImgs as Express.Multer.File[]).map(uploadToS3)
      );

      // 피드 데이터 생성
      const feedData = {
        influencer_id: influencerId, // 예시로 influencer_id 5
        description,
        visibility_level: grade,
        images: thumbnailUrls, // S3 업로드된 이미지 URLs
        product: productImgUrls.map((img, index) => ({
          img,
          title: productImgsTitle[index] || '', // 제목은 없을 경우 빈 문자열
          link: productImgsLink[index] || '', // 링크는 없을 경우 빈 문자열
        })),
        likes: '[]', // 초기값 빈 배열
      };
      // 데이터베이스에 피드 저장
      const savedFeed = await saveFeedToDB(feedData);

      // rabbitMQ 큐에 메시지 전송하기 (feedid, content, influencerid)
      const feedId = savedFeed.dataValues.id;
      const postInfoMsg = {
        feedId,
        influencerId,
        message: description,
      };
      try {
        console.log('Sending message to RabbitMQ:', postInfoMsg);
        await sendMsgToQueue(postInfoMsg);
      } catch (error) {
        console.error('RabbitMQ 메시지 전송 실패:', error);
      }

      res.status(200).json({ message: '피드 등록완료하였습니다.' });
    } catch (error) {
      console.error('피드 등록 중 오류 발생:', error);
      res.status(500).json({ error: '업로드 실패' });
    }
  });
};

// 피드 업데이트 함수
export const FeedUpdate = async (req: Request, res: Response) => {
  upload(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ error: '파일 업로드 실패' });
    }
    try {
      const { id } = req.params;
      const { description, grade, productImgsLink, productImgsTitle } =
        req.body;
      const {
        postImages: existingPostImages,
        productImgs: existingProductImgs,
      } = req.body;

      const { postImages, productImgs } = req.files as {
        postImages?: Express.Multer.File[];
        productImgs?: Express.Multer.File[];
      };

      if (!id) {
        return res.status(400).json({ error: '필수 데이터가 누락되었습니다.' });
      }

      const existingFeed = await Feed.findOne({ where: { id } });
      if (!existingFeed) {
        return res.status(404).json({ error: '피드를 찾을 수 없습니다.' });
      }
      // return console.log(existingFeed.dataValues, 'existingFeedexistingFeed');

      // 기존 데이터 안전하게 파싱
      const parsedExistingPostImages = parseInputData(existingPostImages);
      const parsedExistingProductImgs = parseInputData(existingProductImgs);
      const objProductImgs = parsedExistingProductImgs.map((img, index) => ({
        img,
        title: productImgsTitle[index],
        link: productImgsLink[index],
      }));

      // S3에 업로드된 이미지 URL 배열 가져오기
      const uploadedPostImages = postImages
        ? await Promise.all(postImages.map(uploadToS3))
        : [];
      const uploadedProductImgs = productImgs
        ? await Promise.all(productImgs.map(uploadToS3))
        : [];

      // 기존 데이터와 새 데이터를 병합
      const finalPostImages = [
        ...parsedExistingPostImages,
        ...uploadedPostImages,
      ];
      const finalProductImgs = [
        ...objProductImgs,
        ...uploadedProductImgs.map((img, index) => ({
          img,
          title: productImgsTitle
            ? productImgsTitle[parsedExistingProductImgs.length + index] || ''
            : '',
          link: productImgsLink
            ? productImgsLink[parsedExistingProductImgs.length + index] || ''
            : '',
        })),
      ];

      // 데이터베이스 업데이트
      await Feed.update(
        {
          content: description,
          visibility_level: grade,
          images: JSON.stringify(finalPostImages),
          products: JSON.stringify(finalProductImgs),
        },
        { where: { id } }
      );

      // 기존피드
      const existingFeedPost = JSON.parse(
        existingFeed.dataValues.images as string
      );
      const existingFeedProduct = JSON.parse(
        existingFeed.dataValues.products as string
      );
      // 분리
      const postImagesToDelete = existingFeedPost.filter(
        (img: string) =>
          !finalPostImages || !finalPostImages.some((item) => item === img)
      );

      const productImgsToDelete = existingFeedProduct.filter(
        (product: { img: string; title: string; link: string }) =>
          !finalProductImgs ||
          !finalProductImgs.some((uploaded) => uploaded.img === product.img)
      );

      // 삭제
      await productImgsToDelete.map(
        (item: { img: string; title: string; link: string }) => {
          return deleteFromS3(item.img);
        }
      );
      await postImagesToDelete.map((item: string) => {
        return deleteFromS3(item);
      });

      res.status(200).json({ message: '피드가 성공적으로 수정되었습니다.' });
    } catch (error) {
      console.error('피드 수정 실패:', error);
      res.status(500).json({ error: '피드 수정 실패' });
    }
  });
};

// 핸들러 함수
export const FeedDelete = async (
  req: Request<{ id: string }>, // req.params의 타입 정의
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'ID가 제공되지 않았습니다.' });
      return;
    }
    const feed = await getFeedById(Number(id));
    // console.log(feed, 'feedfeedfeed');
    console.log(
      JSON.parse(feed.products as string)
      // JSON.parse(feed.images) as string[]
    );
    const feedImgs = JSON.parse(feed.products as string);
    const products = JSON.parse(feed.images as string);

    await products.map(deleteFromS3);
    await feedImgs.map((item: { img: string; title: string; link: string }) => {
      return deleteFromS3(item.img);
    });

    const deletedCount = await Feed.destroy({ where: { id: Number(id) } });

    if (deletedCount === 0) {
      res.status(404).json({ error: '삭제할 피드를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json({ message: '피드가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('피드 삭제 실패:', error);
    res.status(500).json({ error: '피드 삭제 중 문제가 발생했습니다.' });
  }
};

export const FeedLikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers['authorization'] as string; // 요청 헤더 출력

    // Bearer 부분 제거하고 실제 토큰만 가져오기
    const tokenWithoutBearer = token.split(' ')[1];

    // JWT 디코딩
    const decoded = jwt.verify(
      tokenWithoutBearer,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    const userId = decoded.userId;
    const feedId = req.params.id;

    if (!userId || !feedId) {
      res.status(400).json({ message: 'Missing userId or feedId' });
      return;
    }

    // 데이터베이스에서 해당 게시글 조회
    const feed = await Feed.findByPk(Number(feedId));
    if (!feed) {
      res.status(404).json({ message: 'Feed not found' });
      return;
    }

    // 좋아요 배열 처리
    let likes: string[] = [];

    // likes를 가져오고 수정하는 방식
    const feedLikes = feed.get('likes');

    // 'likes'가 존재하고 문자열일 경우에만 JSON 파싱을 시도합니다.
    if (feedLikes) {
      if (typeof feedLikes === 'string') {
        try {
          likes = JSON.parse(feedLikes); // 문자열을 배열로 변환
          if (!Array.isArray(likes)) {
            likes = []; // likes가 배열이 아닐 경우 빈 배열로 초기화
          }
        } catch (error) {
          console.error('Failed to parse likes:', error);
          likes = []; // 파싱 실패 시 빈 배열로 초기화
        }
      } else if (Array.isArray(feedLikes)) {
        likes = feedLikes; // 'likes'가 이미 배열이면 그대로 할당
      } else {
        likes = []; // 그 외의 경우에는 빈 배열로 초기화
      }
    }

    console.log('Decoded:', userId);
    if (likes.includes(userId.toString())) {
      // 이미 좋아요한 경우, 제거
      likes = likes.filter((id) => id !== userId.toString());
    } else {
      // 좋아요 추가
      likes.push(userId.toString());
    }

    // 'likes' 배열을 JSON 문자열로 변환하여 저장
    feed.set('likes', JSON.stringify(likes));

    // 업데이트 후 저장
    await feed.save();

    // 응답 반환
    res.status(200).json({
      message: 'Like status updated',
      // likes: JSON.parse(feed.get('likes') as string),
    });
  } catch (error) {
    console.error('FeedLikes Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// admin
export const AdminFeedGetAll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Feed 모델에서 모든 피드 조회, Influencer와 User 모델도 포함
    const feeds = await Feed.findAll({
      attributes: [
        'id',
        'influencer_id',
        'content',
        'images',
        'products',
        'visibility_level',
        'likes',
        'created_at',
        'modified_at',
      ],
      include: [
        {
          model: Influencer,
          as: 'influencer', // 관계 이름
          include: [
            {
              model: User,
              as: 'user', // 관계 이름
              attributes: ['username'], // User 테이블에서 username만 가져오기
            },
          ],
        },
      ],
    });

    console.log(feeds, 'feeds');

    // 피드가 없다면 404 반환
    if (feeds.length === 0) {
      res.status(404).json({ message: '피드가 없습니다.' });
      return;
    }

    // 피드 목록을 반환, 각 피드에서 influencer의 username을 추출
    const parsedFeeds = feeds.map((feed) => {
      const parsedFeed = feed.toJSON();
      return {
        ...parsedFeed,
        influencer: parsedFeed?.influencer?.user?.username, // influencer에서 username만 추출
      };
    });

    res.status(200).json(parsedFeeds); // 변환된 피드 목록 반환
  } catch (error) {
    console.error('FeedGetAll Error:', error);
    res.status(500).json({
      message: '피드 ���록을 가져오는 중 오류가 발생했습니다.',
    });
  }
};
