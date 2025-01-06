/**
 * homeFeed.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 */

import { Router } from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { getFeeds, getFeedsQueue, getMembershipFromUserId, getMembershipProduct, getMembershipProductsFromInfluencerId, getUserMembershipLevel, patchFeedLikes, patchUserFollow, postCurrentLoggedInUserInfo, postFeedDatatoInfluencerData, postInfluencerUsernameInfo, postUserIdByInfluencerId, postUsernameByUserId, getFollowingFeeds } from "../controllers/homeFeed/homeFeedController";

dotenv.config();

const router = Router();
router.use(cookieParser())

router.post("/postcurrentloggedinuserinfo", postCurrentLoggedInUserInfo);
router.post("/getfeeds", getFeeds);
router.post("/getfeeds", getFeeds);
router.post("/feeddatatoinfluencerdata", postFeedDatatoInfluencerData);
router.patch("/patchuserfollow", patchUserFollow);
router.patch("/:feedId/likes", patchFeedLikes);
router.post("/postinfluencerusernameinfo", postInfluencerUsernameInfo); // 안씀
router.post("/postuseridbyinfluencerid", postUserIdByInfluencerId);
router.post("/postusernamebyuserid", postUsernameByUserId);
router.get("/getmembershipproduct", getMembershipProduct);
router.get("/getusermembershiplevel", getUserMembershipLevel)
router.get("/getMembershipProductsFromInfluencerId",getMembershipProductsFromInfluencerId)
router.post("/getMembershipFromUserId",getMembershipFromUserId)
router.post("/getFeedsQueue",getFeedsQueue)
router.post("/getfollowingfeeds", getFollowingFeeds);

export { router };

