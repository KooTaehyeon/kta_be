import { Request, Response } from "express";
import { MembershipProduct } from "../models/membershipProduct";
import { Membership } from "../models/membership";

export const getMembershipProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { influencerId } = req.params;

  try {
    // 해당 인플루언서의 모든 멤버십 상품 가져오기
    const products = await MembershipProduct.findAll({
      where: { influencer_id: influencerId },
    });

    if (products.length === 0) {
      res.status(404).json({ error: "No membership products found" });
      return;
    }

    res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching membership products:", error.message);
    res.status(500).json({ error: "Failed to fetch membership products" });
  }
};

export const subscribeMembership = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { user_id: userId, product_id: productId } = req.body;

  if (!userId || !productId) {
    res.status(400).json({ success: false, message: "Invalid input" });
    return;
  }

  try {
    // 상품 유효성 확인
    const product = await MembershipProduct.findByPk(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Membership product not found",
      });
      return;
    }

    // 현재 활성화된 구독을 확인
    const activeSubscription = await Membership.findOne({
      where: {
        user_id: userId,
        status: "active",
      },
    });
    
    if (activeSubscription) {
      console.log("Subscription ID:", activeSubscription.get("id"));
      console.log("Subscription Status:", activeSubscription.get("status"));
    
      // 상태 업데이트
      activeSubscription.set("status", "inactive");
      await activeSubscription.save();
      console.log("Updated Subscription:", activeSubscription.toJSON());
    }
    

    // 새 구독 생성
    const newSubscription = await Membership.create({
      user_id: userId,
      product_id: productId,
      start_date: new Date(),
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: activeSubscription
        ? "Subscription updated successfully"
        : "Subscription created successfully",
      data: newSubscription,
    });
  } catch (error) {
    console.error("Error subscribing to membership:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const getSubscriptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  console.log("User ID:", userId);

  if (!userId) {
    res.status(400).json({ success: false, message: "User ID is required" });
    return;
  }

  try {
    // 특정 사용자의 구독 정보 조회
    const subscriptions = await Membership.findAll({
      where: { user_id: userId, status: "active" }, // 활성 상태 구독만 조회
      include: [
        {
          model: MembershipProduct,
          as: "product",
          attributes: ["id", "name", "price", "benefits", "influencer_id"],
        },
      ],
    });

    // console.log("Subscriptions:", subscriptions);

    // 클라이언트에게 반환
    res.status(200).json(subscriptions)
    } catch (error: any) {
    console.error("Error fetching subscriptions:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
