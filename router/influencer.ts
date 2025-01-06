import express from "express";
import {
  exitInfluencer,
  followInfluencer,
  getInfluencer,
  getInfluencers,
  registerInfluencer,
  getInfluenerByuser,
  applyInfluencer,
  getApplies,
  approveInfluencer,
  rejectInfluencer,
  checkPendingApplication,
} from "../controllers/influencerController";


const router = express.Router();

router.get("/all", getInfluencers);
router.get("/:id", getInfluencer);
//user_id로 인플정보 --윤호
router.get("/user/:id", getInfluenerByuser);
router.post("/follow", followInfluencer);
router.post("/register", registerInfluencer);
router.delete("/:id", exitInfluencer);

router.post("/apply", applyInfluencer);

router.get("/apply/check/:userId", checkPendingApplication); // 펜딩 상태 확인
router.get("/apply/all", getApplies);

router.put("/apply/:id/approve", approveInfluencer);
router.put("/apply/:id/reject", rejectInfluencer);
export { router };