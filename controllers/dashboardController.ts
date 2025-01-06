import { Request, Response } from 'express';
import { db } from '../models';
import { Op } from 'sequelize';

// 오늘 날짜의 시작과 끝을 구하는 함수
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// 오늘 가입자 수 조회
export const getTodayUserCount = async (req: Request, res: Response) => {
  try {
    const { start, end } = getTodayRange();

    const count = await db.User.count({
      where: {
        created_at: {
          [Op.between]: [start, end],
        },
      },
    });

    res.json({ todayUserCount: count });
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 총 가입자 수 조회
export const getTotalUserCount = async (req: Request, res: Response) => {
  try {
    const count = await db.User.count();
    res.json({ totalUserCount: count });
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 피드 글 갯수 조회
export const getFeedCount = async (req: Request, res: Response) => {
  try {
    const count = await db.Feed.count();
    res.json({ feedCount: count });
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 날짜별 피드 수 조회
export const getFeedCountByDate = async (req: Request, res: Response) => {
  try {
    const feedCounts = await db.Feed.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('created_at')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
      ],
      group: ['date'],
      order: [['date', 'ASC']],
    });

    res.json(feedCounts);
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 날짜별 가입자 수 조회
export const getUserCountByDate = async (req: Request, res: Response) => {
  try {
    const userCounts = await db.User.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('created_at')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
      ],
      group: ['date'],
      order: [['date', 'ASC']],
    });

    res.json(userCounts);
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 날짜별 결제금액 조회
export const getPaymentAmountByDate = async (req: Request, res: Response) => {
  try {
    const paymentAmounts = await db.Payment.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('created_at')), 'date'],
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'amount'],
      ],
      group: ['date'],
      order: [['date', 'ASC']],
    });

    res.json(paymentAmounts);
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
};

// 모든 통계 한 번에 조회
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { start, end } = getTodayRange();

    const safeCount = async (query: Promise<any>) => {
      try {
        return await query;
      } catch {
        return 0; // 실패 시 기본값 반환
      }
    };

    const [
      todayUserCount,
      totalUserCount,
      feedCount,
      influencerCount,
      todayFeedCount,
      totalMembershipCount,
      influencerFollowers,
      feedCountsByDate,
      userCountsByDate,
      paymentAmountsByDate,
    ] = await Promise.all([
      safeCount(db.User.count({
        where: {
          created_at: {
            [Op.between]: [start.toISOString(), end.toISOString()],
          },
        },
      })),
      safeCount(db.User.count()),
      safeCount(db.Feed.count()),
      safeCount(db.Influencer.count()),
      safeCount(db.Feed.count({
        where: {
          created_at: {
            [Op.between]: [start.toISOString(), end.toISOString()],
          },
        },
      })),
      safeCount(db.Membership.count()),
      safeCount(db.Influencer.findAll({
        attributes: ['follower'],
      })),
      safeCount(db.Feed.findAll({
        attributes: [
          [db.sequelize.fn('DATE', db.sequelize.col('created_at')), 'date'],
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
        ],
        group: ['date'],
        order: [['date', 'ASC']],
      })),
      safeCount(db.User.findAll({
        attributes: [
          [db.sequelize.fn('DATE', db.sequelize.col('created_at')), 'date'],
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
        ],
        group: ['date'],
        order: [['date', 'ASC']],
      })),
      safeCount(db.Payment.findAll({
        attributes: [
          [db.sequelize.fn('DATE', db.sequelize.col('created_at')), 'date'],
          [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'amount'],
        ],
        group: ['date'],
        order: [['date', 'ASC']],
      })),
    ]);

    const followersArray = influencerFollowers
      .map(influencer => {
        try {
          return JSON.parse(influencer.follower).map(Number);
        } catch {
          return [];
        }
      });

    const allFollowers = [].concat(...followersArray);
    const minFollowers = allFollowers.length ? Math.min(...allFollowers) : 0;
    const maxFollowers = allFollowers.length ? Math.max(...allFollowers) : 0;
    const avgFollowers = allFollowers.length ? allFollowers.reduce((sum, val) => sum + val, 0) / allFollowers.length : 0;

    res.json({
      todayUserCount,
      totalUserCount,
      feedCount,
      influencerCount,
      todayFeedCount,
      totalMembershipCount,
      influencerFollowerStats: {
        minFollowers,
        maxFollowers,
        avgFollowers,
      },
      feedCountsByDate,
      userCountsByDate,
      paymentAmountsByDate,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: '서버 오류', details: error.message });
  }
};
