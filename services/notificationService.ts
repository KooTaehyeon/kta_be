import { Feed } from "../models/feed";
import { Influencer } from "../models/influencer";
import { Notification } from "../models/notification";
import { User } from "../models/user";
//팔로워 목록 가져오기
export const getFollowersByInfluencerId = async (influencerId: number) => {
  const influencer = await Influencer.findOne({
    where: { id: influencerId },
  });
  if (!influencer) {
    console.log(`Influencer with ID ${influencerId} not found`);
    return [];
  }
  try {
    const followers: any = influencer.dataValues.follower;
    const numericalFollowers: number[] = JSON.parse(followers).map(
      (id: string) => Number(id)
    );
    return numericalFollowers;
  } catch (error) {
    console.error(error);
    return [];
  }
};

//db에 알림 저장
export async function saveNotification(followers: number[], feedId: number): Promise<boolean> {
  try {
    // feedId가 Feed 테이블에 존재하는지 확인
    const feedExists = await Feed.findByPk(feedId);
    if (!feedExists) {
      console.log(`피드 ID ${feedId}를 찾을 수 없습니다.`);
      return false;
    }

    const notifications = followers.map((followerId) => ({
      user_id: followerId,
      feed_id: feedId, // feed_id 필드 추가
      is_read: false,
    }));

    await Notification.bulkCreate(notifications);
    console.log(`${notifications.length}개의 알림이 성공적으로 생성되었습니다.`);
    return true;
  } catch (error) {
    console.error("알림 저장 중 오류 발생:", error);
    throw error;
  }
}

export async function getNotificationsByUserId(userId: number) {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Feed,
          as: "feed",
          include: [
            {
              model: Influencer,
              as: "influencer",
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "username"], // 필요한 필드만 가져오기
                },
              ],
            },
          ],
        },
      ],
    });
    return notifications;
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    throw new Error("알림 조회 중 오류가 발생했습니다.");
  }
}

export async function deleteNotificationById(notificationId: number) {
  try {
    const result = await Notification.destroy({
      where: { id: notificationId },
    });
    if (!result) {
      throw new Error(`알림 ID ${notificationId}을 찾을 수 없습니다.`);
    }
    console.log(`알림 ID ${notificationId}가 삭제됐습니다.`);
  } catch (error) {
    console.error("알림 삭제 중 오류:", error);
    throw error;
  }
}
