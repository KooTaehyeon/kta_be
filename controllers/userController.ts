import { Request, Response } from "express";
import {
  findFollowingsByUser,
  getAllUsersWithInfluencerInfo,
  getUserById,
  updateUser,
} from "../services/userService";
import { findFeedsByUser, findFeedsLikedByUser } from "../services/feedService"; // feedService에서 함수 가져오기
import { formatUserResponse } from "../util/userResponse"; // 유틸 함수 가져오기
import { deleteFromS3, uploadToS3 } from "../util/uplode";

// 사용자 정보 조회
export const getUserProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await getUserById(Number(req.params.id));
    const response = formatUserResponse(user);
    res.status(200).json(response);
  } catch (error) {
    console.error("사용자 정보 가져오기 오류:", error);
    res
      .status(500)
      .json({ error: "사용자 정보를 가져오는 중 오류가 발생했습니다." });
  }
};

// 사용자 정보 업데이트
export const updateUserProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    let profilePictureUrl: string | undefined;
    let bannerPictureUrl: string | undefined;

    // 프로필 이미지 업로드 처리
    const profilePictureFile = files?.profile_picture?.[0];
    if (profilePictureFile) {
      profilePictureUrl = await uploadToS3(profilePictureFile);
    }

    // 배너 이미지 업로드 처리
    const bannerPictureFile = files?.banner_picture?.[0];
    if (bannerPictureFile) {
      bannerPictureUrl = await uploadToS3(bannerPictureFile);
      console.log("Uploaded banner picture URL:", bannerPictureUrl);
    }

    // 기존 프로필 이미지 삭제
    if (
      req.body.existingProfilePicture &&
      req.body.isNewProfilePicture === "true"
    ) {
      const oldKey = req.body.existingProfilePicture.split("/").pop(); // 기존 파일의 키 추출
      if (oldKey) {
        console.log("Deleting existing profile picture:", oldKey);
        await deleteFromS3(oldKey);
      }
    }

    // 기존 배너 이미지 삭제
    if (
      req.body.existingBannerPicture &&
      req.body.isNewBannerPicture === "true"
    ) {
      const oldKey = req.body.existingBannerPicture.split("/").pop(); // 기존 파일의 키 추출
      if (oldKey) {
        await deleteFromS3(oldKey);
      }
    }
    let influencerData;
    if (req.body.influencer) {
      influencerData = JSON.parse(req.body.influencer);
    }

    const updatedUser = await updateUser(Number(req.params.id), {
      ...req.body,
      profile_picture:
        profilePictureUrl ||
        (req.body.isNewProfilePicture === "true"
          ? null
          : req.body.existingProfilePicture),
      influencer: {
        ...influencerData,
        banner_picture:
          bannerPictureUrl ||
          (req.body.isNewBannerPicture === "true"
            ? null
            : req.body.existingBannerPicture),
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("사용자 업데이트 오류:", error);
    res
      .status(500)
      .json({ error: "사용자 정보를 업데이트하는 중 오류가 발생했습니다." });
  }
};

// 사용자가 좋아요한 피드 조회
export const findLikeFeedForUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const feeds = await findFeedsLikedByUser(Number(req.params.id));

    if (!feeds || feeds.length === 0) {
      res.status(200).json([]);
      return;
    }

    res.status(200).json(feeds);
  } catch (error) {
    console.error("사용자가 좋아요한 피드 가져오기 오류:", error);
    res.status(500).json({
      error: "사용자가 좋아요한 피드를 가져오는 중 오류가 발생했습니다.",
    });
  }
};

// 사용자가 작성한 피드 조회
export const findFeedsForUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const feeds = await findFeedsByUser(Number(req.params.id));

    if (!feeds || feeds.length === 0) {
      res
        .status(404)
        .json({ error: "사용자가 작성한 피드를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json(feeds);
  } catch (error) {
    console.error("사용자가 작성한 피드 가져오기 오류:", error);
    res.status(500).json({
      error: "사용자가 작성한 피드를 가져오는 중 오류가 발생했습니다.",
    });
  }
};

// 사용자가 팔로우한 인플루언서 조회
export const findFollowInfluencerForUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const followings = await findFollowingsByUser(Number(req.params.id));

    if (!followings || followings.length === 0) {
      res.status(200).json([]);
      return;
    }

    res.status(200).json(followings);
  } catch (error) {
    console.error("사용자가 좋아요한 피드 가져오기 오류:", error);
    res.status(500).json({
      error: "사용자가 좋아요한 피드를 가져오는 중 오류가 발생했습니다.",
    });
  }
};

// 모든 사용자 정보 조회
export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await getAllUsersWithInfluencerInfo();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};
