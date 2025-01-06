import { Request, Response } from "express";
import {
  getProductsByUserId,
  updateMembership,
  createMembershipProduct,
  deleteMembershipProduct,
  getProductsByInfluencerId,
  productStatusToggle,
  deleteMembershipImg,
} from "../services/membershipProductService";

// 인플루언서의 멤버십 상품 가져오기(인플루언서 아이디로)
export const getMembershipProductsByInfluencerId = async (
  req: any,
  res: any,
) => {
  const { influencerId } = req.params;
  try {
    const products = await getProductsByInfluencerId(Number(influencerId));
    if (products.length === 0) {
      res.status(404).json({ error: "No membership products found" });
      return;
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch membership products" });
  }
};

// 인플루언서의 멤버십 상품 가져오기(유저 아이디로)
export const getMembershipProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.params;

  try {
    const products = await getProductsByUserId(Number(userId));

    if (products.length === 0) {
      res.status(404).json({ error: "No membership products found" });
      return;
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch membership products" });
  }
};
export const updateMembershipProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.productId;
  const updateData = req.body;
  if (Array.isArray(updateData.benefits)) {
    updateData.benefits = updateData.benefits.join(",");
  }
  try {
    const updatedMembership = await updateMembership(
      Number(id),
      updateData,
      req.file,
    );
    if (!updatedMembership) {
      res.status(404).json({ error: "Membership not found" });
      return;
    }
    res.status(200).json(updatedMembership);
  } catch (error) {
    console.error("Error updating membership:", error);
    res.status(500).json({ error: "Failed to update membership" });
  }
};

export const createMembershipProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productData = {
    influencerId: req.body.influencer_id,
    level: req.body.level,
    name: req.body.name,
    price: req.body.price,
    benefits: req.body.benefits,
  };
  const image = req.file ?? null;
  try {
    const newProduct = await createMembershipProduct(productData, image);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating membership product:", error);
    res.status(500).json({ error: "Failed to create membership product" });
  }
};

// 멤버십 상품 삭제
export const deleteMembershipProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { productId } = req.params;
  try {
    await deleteMembershipProduct(Number(productId));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting membership product:", error);
    res.status(500).json({ error: "Failed to delete membership product" });
  }
};

export const toggleProductStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productId = req.params.productId;
  try {
    const updatedProduct = await productStatusToggle(Number(productId));
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error toggling product status:", error);
    res.status(500).json({ error: "Failed to toggle product status" });
  }
};

export const deleteImg = async (req: Request, res: Response): Promise<void> => {
  const { productId, imageUrl } = req.body;
  console.log(req.body);

  if (!productId || !imageUrl) {
    res.status(400).json({ message: "Product ID and Image URL are required" });
    return;
  }

  try {
    // 서비스 호출
    await deleteMembershipImg(productId, imageUrl);

    res.status(200).json({ message: "Image deleted successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete image" });
    return;
  }
};
