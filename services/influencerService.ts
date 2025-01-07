import { Influencer } from "../models/influencer";
import { InfluencerApplication } from "../models/influencerApplication";
import { User } from "../models/user";
import { MembershipProduct } from "../models/membershipProduct";
import { Room } from "../models/room";

export interface InfluencerData {
  id?: number; // 인플루언서 ID
  user_id: number; // 유저 ID
  category: string; // 카테고리
  banner_picture: string; // 배너 이미지
  follower?: string; // 팔로워 JSON 문자열
}

export interface InfluencerApplicationData {
  id?: number; // 데이터베이스에 저장된 경우 자동 생성됨
  user_id: number; // 신청자의 User ID
  category: string; // 신청한 카테고리
  banner_picture: string; // 배너 이미지 URL
  reason?: string | null; // 반려 사유 (반려 시에만 필요)
  status?: "pending" | "approved" | "rejected"; // 신청 상태
  created_at?: Date; // 신청 생성 시각
  reviewed_at?: Date | null; // 검토된 시각
  reviewed_by?: number | null; // 검토를 수행한 관리자 ID
}

// 인플루언서 정보 가져오기
export const getInfluencerById = async (influencerId: number) => {
  try {
    const influencers = await Influencer.findOne({
      where: { id: influencerId },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "username",
            "email",
            "about_me",
            "profile_picture",
          ], // 필요한 사용자 정보만 가져오기
        },
      ],
      attributes: ["id", "follower", "banner_picture", "category"], // 필요한 인플루언서 정보만 가져오기
      raw: true,
      nest: true, // 중첩된 결과를 객체 형태로 반환
    });
    // console.log(influencers);

    if (!influencers) {
      throw new Error("No influencer found");
    }

    return influencers;
  } catch (error) {
    console.error("Error fetching influencer:", error);
    throw new Error("Error fetching influencer");
  }
};

// 모든 인플루언서 정보 가져오기
export const getAllInfluencers = async () => {
  try {
    const influencers = await Influencer.findAll({
      include: [
        {
          model: User,
          attributes: [
            "id",
            "username",
            "email",
            "about_me",
            "profile_picture",
          ], // 필요한 사용자 정보만 가져오기
        },
      ],
      attributes: ["id", "follower", "banner_picture", "category"], // 필요한 인플루언서 정보만 가져오기
      raw: true,
      nest: true, // 중첩된 결과를 객체 형태로 반환
    });
    // console.log(influencers);

    if (influencers.length === 0) {
      throw new Error("No influencers found");
    }

    return influencers;
  } catch (error) {
    console.error("Error fetching influencers:", error);
    throw new Error("Error fetching influencers");
  }
};

// 인플루언서 팔로우 토글
export const toggleFollow = async (userId: number, influencerId: number) => {
  try {
    // 인플루언서 찾기
    const influencer = await Influencer.findOne({
      where: { id: influencerId },
    });

    if (!influencer) {
      throw new Error("Influencer not found");
    }

    // 팔로워 목록 파싱
    let followers: string[] = [];
    try {
      const followerData = influencer.get("follower") as string; // 속성 가져오기
      followers = JSON.parse(followerData || "[]");
    } catch (error) {
      console.error("Error parsing followers:", error);
    }

    const userIdStr = userId.toString();
    const index = followers.indexOf(userIdStr);
    if (index === -1) {
      // 팔로우 추가
      followers.push(userIdStr);
    } else {
      // 팔로우 취소
      followers.splice(index, 1);
    }

    // `set` 메서드로 'follower' 속성 설정
    influencer.set("follower", JSON.stringify(followers));
    await influencer.save();

    return index === -1; // `true`면 팔로우, `false`면 언팔로우
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw new Error("Error toggling follow");
  }
};

export const getFollowers = async (influencerId: number) => {
  try {
    // 인플루언서 찾기
    const influencer = await Influencer.findOne({
      where: { id: influencerId },
    });

    if (!influencer) {
      throw new Error("Influencer not found");
    }

    // 팔로워 목록 가져오기
    const followerData = influencer.get("follower") as string;
    const followers = JSON.parse(followerData || "[]");

    return followers.map((id: string) => parseInt(id, 10)); // 숫자 배열로 반환
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw new Error("Error fetching followers");
  }
};

// 인플루언서 생성
export const createInfluencer = async (data: InfluencerData) => {
  try {
    const newInfluencer = await Influencer.create(data);
    return newInfluencer;
  } catch (error) {
    console.error("Error creating influencer:", error);
    throw new Error("Error creating influencer");
  }
};

// 인플루언서 삭제
export const deleteInfluencer = async (influencerId: number) => {
  try {
    const influencer = await Influencer.findOne({
      where: { id: influencerId },
    });

    if (!influencer) {
      throw new Error("Influencer not found");
    }

    // 멤버십 제품 삭제
    await MembershipProduct.destroy({
      where: { influencer_id: influencerId },
    });

    // 채팅방 삭제
    await Room.destroy({
      where: { influencer_id: influencerId },
    });

    await influencer.destroy();
    return influencer;
  } catch (error) {
    console.error("Error deleting influencer:", error);
    throw new Error("Error deleting influencer");
  }
};

//user_id로 인플정보 --윤호
export const getInfluencerByuserId = async (userId: number) => {
  try {
    const influencers = await Influencer.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "username",
            "email",
            "about_me",
            "profile_picture",
          ], // 필요한 사용자 정보만 가져오기
        },
      ],
      attributes: ["id", "follower", "banner_picture", "category"], // 필요한 인플루언서 정보만 가져오기
    });
    if (!influencers) {
      throw new Error("No influencer found");
    }

    return influencers;
  } catch (error) {
    console.error("Error fetching influencer:", error);
    throw new Error("Error fetching influencer");
  }
};

export const createInfluencerApplication = async (
  data: InfluencerApplicationData,
) => {
  try {
    const existingApplication = await InfluencerApplication.findOne({
      where: { user_id: data.user_id, status: "pending" },
    });

    if (existingApplication) {
      throw new Error("You already have a pending application.");
    }

    const newApplication = await InfluencerApplication.create({
      user_id: data.user_id,
      category: data.category,
      banner_picture: data.banner_picture,
    });
    return newApplication;
  } catch (error) {
    console.error("Error creating influencer application:", error);
    throw new Error("Error creating influencer application");
  }
};

export const getInfluencerApplications = async () => {
  try {
    const applications = await InfluencerApplication.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });
    return applications;
  } catch (error) {
    console.error("Error fetching influencer applications:", error);
    throw new Error("Error fetching influencer applications");
  }
};

export const approveInfluencerApplication = async (
  applicationId: number,
  adminId: number,
) => {
  const application = await InfluencerApplication.findOne({
    where: { id: applicationId, status: "pending" },
  });

  if (!application) {
    throw new Error("Application not found or already processed.");
  }

  // 승인 처리
  application.status = "approved";
  application.reviewed_at = new Date();
  application.reviewed_by = adminId;
  await application.save();

  // 인플루언서 등록
  const influencer = await Influencer.create({
    user_id: application.user_id,
    banner_picture: application.banner_picture,
    category: application.category,
    follower: JSON.stringify([]), // 빈 팔로워 리스트로 시작
  });

  // 채팅방 생성
  await Room.create({
    room_name: `${application.user_id}의 채팅방`,
    influencer_id: influencer.id,
    visibility_level: 1,
  });

  // 기본 멤버십 제품 생성
  const defaultProducts = [
    {
      level: 1,
      name: "레벨 1 멤버십",
      price: 0, // 무료 멤버십
      benefits: "기본 혜택",
      is_active: 0,
      influencer_id: influencer.id,
    },
    {
      level: 2,
      name: "레벨 2 멤버십",
      price: 5000, // 예: 5,000원
      benefits: "추가 혜택",
      is_active: 0,
      influencer_id: influencer.id,
    },
    {
      level: 3,
      name: "레벨 3 멤버십",
      price: 10000, // 예: 10,000원
      benefits: "최고 혜택",
      is_active: 0,
      influencer_id: influencer.id,
    },
  ];

  await MembershipProduct.bulkCreate(defaultProducts);

  return influencer; // 성공적으로 생성된 인플루언서 정보 반환
};

export const rejectInfluencerApplication = async (
  applicationId: number,
  adminId: number,
  reason: string,
) => {
  const application = await InfluencerApplication.findOne({
    where: { id: applicationId, status: "pending" },
  });

  if (!application) {
    throw new Error("Application not found or already processed.");
  }

  // 반려 처리
  application.status = "rejected";
  application.reason = reason;
  application.reviewed_at = new Date();
  application.reviewed_by = adminId;
  await application.save();
};

export const getPendingApplicationByUserId = async (
  userId: number,
): Promise<boolean> => {
  try {
    const application = await InfluencerApplication.findOne({
      where: { user_id: userId, status: "pending" },
    });
    return !!application; // true if a pending application exists
  } catch (error) {
    console.error("Error fetching pending application:", error);
    throw new Error("Error fetching pending application");
  }
};
