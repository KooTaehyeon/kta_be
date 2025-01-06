import { Influencer } from "../models/influencer";
import { MembershipProduct } from "../models/membershipProduct";
import { uploadToS3, deleteFromS3 } from "../util/uplode";

interface UpdateData {
  name?: string;
  price?: number;
  benefits?: string | null; //sequelize의 update에서는 string[]을 허용x
  image?: string;
}

interface CreateProductData {
  influencerId: number;
  name: string;
  price: number;
  benefits: string[];
  level: number;
  image?: string;
}

export const createMembershipProduct = async (
  data: CreateProductData,
  file: Express.Multer.File | null,
) => {
  try {
    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await uploadToS3(file);
    }
    const product = await MembershipProduct.create({
      influencer_id: data.influencerId,
      name: data.name,
      price: data.price,
      benefits: data.benefits.join(","),
      level: data.level,
      image: imageUrl,
    });
    return product;
  } catch (error) {
    console.error("Error creating membership product:", error);
    throw new Error("Failed to create membership product");
  }
};

export const deleteMembershipProduct = async (id: number) => {
  try {
    const product = await MembershipProduct.findByPk(id);
    if (!product) throw new Error("Membership product not found");
    await product.destroy();
  } catch (error) {
    console.error("Error deleting membership product:", error);
    throw new Error("Failed to delete membership product");
  }
};

export const getProductsByInfluencerId = async (influencerId: number) => {
  try {
    const products = await MembershipProduct.findAll({
      where: { influencer_id: influencerId },
      raw: true,
    });
    if (products.length === 0) {
      console.error(
        `Membership products not found for influencerId: ${influencerId}`,
      );
      throw new Error("Membership products not found for this influencer");
    }
    return products;
  } catch (error) {
    console.error("Error fetching membership products:", error);
    throw new Error("Failed to fetch membership products");
  }
};

export const getProductsByUserId = async (userId: number) => {
  try {
    // userId로 Influencer를 찾음
    const influencer = await Influencer.findOne({
      where: { user_id: userId },
      attributes: ["id"], // 필요한 id만 가져옴
      raw: true, // raw: true 사용
    });

    // Influencer가 없을 경우 처리
    if (!influencer) {
      console.error(`Influencer not found for userId: ${userId}`);
      throw new Error("Influencer not found for this user");
    }
    // Influencer ID를 기반으로 MembershipProduct 조회
    const products = await MembershipProduct.findAll({
      where: { influencer_id: influencer.id }, // 필터링
      order: [["level", "ASC"]],
      raw: true,
    });
    // benefits를 배열로 변환
    return products.map((product) => {
      const rawBenefits = product.benefits || ""; // 직접 benefits 접근
      const currentBenefits =
        rawBenefits?.trim() !== ""
          ? rawBenefits.split(",").map((b) => b.trim())
          : [];
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        level: product.level,
        benefits: currentBenefits,
        influencer_id: influencer.id,
        image: product.image || null,
        is_active: product.is_active,
      };
    });
  } catch (error: any) {
    console.error("Error fetching membership products:", error.message);
    throw new Error("Failed to fetch membership products");
  }
};

export const updateMembership = async (
  id: number,
  updateData: UpdateData,
  file?: Express.Multer.File,
) => {
  try {
    const membership = await MembershipProduct.findByPk(id);
    if (!membership) return null;

    if (file) {
      const imageUrl = await uploadToS3(file);
      updateData.image = imageUrl;
    }

    await membership.update(updateData);
    return membership;
  } catch (error) {
    console.error("Error in replaceMembership service:", error);
    throw new Error("Failed to replace membership");
  }
};

export const productStatusToggle = async (productId: number) => {
  try {
    const product = await MembershipProduct.findByPk(productId);
    if (!product) throw new Error("Membership product not found");

    // 현재 상태 가져오기
    const currentStatus = product.getDataValue("is_active");
    const newStatus = currentStatus === 0 ? 1 : 0;

    // 상태 업데이트
    await product.update({ is_active: newStatus });
    await product.reload(); // 갱신된 값 가져오기

    console.log("Updated is_active:", product.getDataValue("is_active"));

    // 갱신된 상태 반환
    return product.getDataValue("is_active");
  } catch (error) {
    console.error("Error toggling product status:", error);
    throw new Error("Failed to toggle product status");
  }
};

export const deleteMembershipImg = async (
  productId: number,
  imageUrl: string,
) => {
  await deleteFromS3(imageUrl);

  await MembershipProduct.update(
    {
      image: null,
    },

    { where: { id: productId } },
  );
};
