import { User } from "../models/user";
import { Influencer } from "../models/influencer";
import { sequelize } from "../util/database";
import { MembershipProduct } from "../models/membershipProduct";

interface InfluencerData {
  id?: number;
  follower: string;
  banner_picture?: string;
  category?: string;
}

interface UserData {
  username: string;
  email: string;
  password: string;
  id?: number;
  about_me?: string;
  profile_picture?: string;
}

// 사용자 ID로 사용자 정보 조회
export const getUserById = async (userId: number) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Influencer,
          attributes: ["id", "follower", "banner_picture", "category"],
        },
      ],
      attributes: ["id", "username", "email", "about_me", "profile_picture"],
      raw: true,
      nest: true,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Error fetching user");
  }
};

// 사용자 정보 업데이트
export const updateUser = async (
  userId: number,
  updates: Partial<UserData & { influencer: Partial<InfluencerData> }>,
) => {
  try {
    const { influencer, profile_picture, ...userUpdates } = updates;

    const [affectedRows] = await User.update(
      { ...userUpdates, profile_picture },
      {
        where: { id: userId },
      },
    );

    if (affectedRows === 0) {
      throw new Error("User not found");
    }

    if (influencer) {
      if (influencer.follower) {
        influencer.follower = JSON.stringify(influencer.follower);
      }
      const influencerInstance = await Influencer.findOne({
        where: { user_id: userId },
      });

      if (influencerInstance) {
        await influencerInstance.update({
          ...influencer,
          category: influencer.category,
          banner_picture: influencer.banner_picture,
        }); // 기존 인플루언서 정보 업데이트
      }
      // else {
      //   const user = await User.findByPk(userId);

      //   await Influencer.create({
      //     user_id: userId,
      //     ...influencer,
      //   }); // 새로운 인플루언서 정보 생성
      // }
    }

    const updatedUser = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Influencer,
          attributes: [
            "id",
            "user_id",
            "category",
            "banner_picture",
            "follower",
          ],
        },
      ],
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
};

// 사용자가 팔로우한 인플루언서 조회
export const findFollowingsByUser = async (userId: number) => {
  try {
    const follows = await Influencer.findAll({
      where: sequelize.literal(`JSON_CONTAINS(follower, '"${userId}"')`),
      attributes: ["id", "user_id", "follower", "category"],
      include: [
        {
          model: User,
          attributes: ["username", "about_me", "profile_picture"], // 필요한 User 속성만 포함
        },
      ],
      raw: true,
      nest: true, // 중첩된 결과를 객체로 반환
    });

    // console.log("follows with user info: ", follows);
    return follows.length > 0 ? follows : [];
  } catch (error) {
    console.error("Error fetching followers by user:", error);
    throw new Error("Error fetching followers by user");
  }
};

// 모든 유저 정보 조회
export const getAllUsersWithInfluencerInfo = async () => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "about_me",
        "profile_picture",
        "created_at",
      ],
      include: [
        {
          model: Influencer,
          attributes: ["id", "category", "banner_picture", "follower"],
          include: [
            {
              model: MembershipProduct,
              as: "products", // Alias 명시
              attributes: [
                "id",
                "level",
                "name",
                "image",
                "price",
                "benefits",
                "is_active",
              ],
            },
          ],
        },
      ],
    });

    // 팔로워 수 및 멤버십 상품 정보 추가
    return users.map((user: any) => {
      const influencer = user.Influencer
        ? {
            id: user.Influencer.id,
            category: user.Influencer.category,
            banner_picture: user.Influencer.banner_picture,
            follower_count: JSON.parse(user.Influencer.follower || "[]").length,
            products:
              user.Influencer.products?.map((product: any) => ({
                id: product.id,
                level: product.level,
                name: product.name,
                image: product.image,
                price: product.price,
                benefits: product.benefits,
                is_active: !!product.is_active,
              })) || [],
          }
        : null;

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        about_me: user.about_me,
        profile_picture: user.profile_picture,
        created_at: user.created_at,
        is_influencer: !!influencer,
        influencer,
      };
    });
  } catch (error) {
    console.error("Error fetching users with influencer info:", error);
    throw new Error("Error fetching users.");
  }
};

// 인플루언서 ID로 사용자 정보 조회
export const getUserByInfluencerId = async (influencerId: number) => {
  try {
    const influencer = await Influencer.findOne({
      where: { id: influencerId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "email", "about_me", "profile_picture"],
        },
      ],
    });

    if (!influencer) {
      throw new Error("Influencer not found");
    }

    return influencer.get('User');
  } catch (error) {
    console.error("Error fetching user by influencer ID:", error);
    throw new Error("Error fetching user");
  }
};
