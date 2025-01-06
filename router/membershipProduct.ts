import express from "express";
import multer from "multer";
import {
  createMembershipProducts,
  deleteMembershipProducts,
  getMembershipProductsByInfluencerId,
  toggleProductStatus,
  deleteImg,
} from "../controllers/membershipProductController";
import {
  getSubscriptions,
  subscribeMembership,
} from "../controllers/membershipController";
import {
  getMembershipProducts,
  updateMembershipProducts,
} from "../controllers/membershipProductController";
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(), // 파일을 메모리에 저장
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
});

router.patch("/product/:productId", toggleProductStatus);

router.get("/products/:userId", getMembershipProducts);
router.patch(
  "/products/:productId",
  upload.single("image"),
  updateMembershipProducts,
);
router.delete("/image", deleteImg);
router.post("/products", upload.single("image"), createMembershipProducts);
router.delete("/products/:productId", deleteMembershipProducts);

router.get("/allproducts/:influencerId", getMembershipProductsByInfluencerId);
router.get("/subscriptions/:userId", getSubscriptions);
router.post("/subscribe", subscribeMembership);

export { router };
