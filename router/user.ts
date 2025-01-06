import express from "express";
import {
  findFeedsForUser,
  findFollowInfluencerForUser,
  findLikeFeedForUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";
import multer from "multer";

import { validateUserId } from "../middlewares/validateUserId";
const upload = multer();
const router = express.Router();

router.get("/all", getAllUsers);
router.get("/:id", validateUserId, getUserProfile);
router.put(
  "/:id",
  validateUserId,
  upload.fields([
    { name: "profile_picture", maxCount: 1 }, // 프로필 이미지
    { name: "banner_picture", maxCount: 1 }, // 배너 이미지
  ]),
  updateUserProfile,
);
router.get("/:id/likes", validateUserId, findLikeFeedForUser);
router.get("/:id/follows", validateUserId, findFollowInfluencerForUser);
router.get("/:id/feeds", validateUserId, findFeedsForUser);

export { router };
