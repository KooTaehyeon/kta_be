import { Request, Response } from "express";
import {
  createInfluencer,
  deleteInfluencer,
  getAllInfluencers,
  getInfluencerById,
  toggleFollow,
  getInfluencerByuserId,
  createInfluencerApplication,
  getInfluencerApplications,
  rejectInfluencerApplication,
  approveInfluencerApplication,
  getPendingApplicationByUserId,
} from "../services/influencerService";

export const getInfluencer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const influencers = await getInfluencerById(Number(req.params.id));
    res.status(200).json(influencers);
  } catch (error) {
    console.error("인플루언서 가져오기 오류:", error);
    res
      .status(500)
      .json({ error: "인플루언서 정보를 가져오는 중 오류가 발생했습니다." });
  }
};

export const getInfluencers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const influencers = await getAllInfluencers();
    res.status(200).json(influencers);
  } catch (error) {
    console.error("전체 인플루언서 가져오기 오류:", error);
    res
      .status(500)
      .json({
        error: "전체 인플루언서 정보를 가져오는 중 오류가 발생했습니다.",
      });
  }
};

export const followInfluencer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId, influencerId } = req.body;
  try {
    const isFollowing = await toggleFollow(userId, influencerId);
    res.status(200).json(isFollowing);
  } catch (error) {
    console.error("인플루언서 팔로우 처리 오류:", error);
    res
      .status(500)
      .json({ error: "인플루언서 팔로우 중 오류가 발생했습니다." });
  }
};

export const registerInfluencer = async (req: Request, res: Response) => {
  try {
    const { user_id, follower, banner_picture, category } = req.body;

    if (!user_id || !category) {
      res.status(400).json({ error: "Missing required fields" });
    }

    const newInfluencer = await createInfluencer({
      user_id,
      follower: JSON.stringify(follower), // 배열을 JSON 문자열로 변환
      banner_picture,
      category,
    });

    res.status(201).json(newInfluencer);

  } catch (error) {
    console.error("Error registering influencer:", error);
    res.status(500).json({ error: "Failed to register influencer" });
  }
};

export const exitInfluencer = async (req: Request, res: Response) => {
  try {
    const influencerId = Number(req.params.id);
    if (!influencerId) {
      res.status(400).json({ error: "Invalid influencer ID" });
    }

    const deletedInfluencer = await deleteInfluencer(influencerId);
    res.status(200).json(deletedInfluencer);
  } catch (error) {
    console.error("Error deleting influencer:", error);
    res.status(500).json({ error: "Failed to delete influencer" });
  }
};

//user_id로 인플정보 --윤호
export const getInfluenerByuser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const influencers = await getInfluencerByuserId(Number(req.params.id));
    res.status(200).json(influencers);
  } catch (error) {
    console.error("인플루언서 가져오기 오류:", error);
    res
      .status(500)
      .json({ error: "인플루언서 정보를 가져오는 중 오류가 발생했습니다." });
  }
};

// 인플루언서 신청
export const applyInfluencer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, category, banner_picture } = req.body;
    console.log(user_id, category, banner_picture);

    if (!user_id || !category) {
      res.status(400).json({ error: "Missing required fields: user_id or category" });
      return;
    }

    // 새로운 인플루언서 신청 레코드 생성
    const application = await createInfluencerApplication({
      user_id,
      category,
      banner_picture: banner_picture || null,
    });

    res.status(201).json({
      message: "Influencer application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("Error applying for influencer:", error);
    res.status(500).json({ error: "Failed to apply for influencer" });
  }
};

// 모든 인플루언서 신청 목록 가져오기
export const getApplies = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await getInfluencerApplications();
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching influencer applications:", error);
    res.status(500).json({ error: "Failed to fetch influencer applications" });
  }
}

export const approveInfluencer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Application ID is required" });
      return;
    }

    await approveInfluencerApplication(Number(id), 1); // req.user.id는 관리자의 ID로 가정
    res.status(200).json({ message: "Application approved successfully." });
  } catch (error) {
    console.error("Error approving influencer application:", error);
    res.status(500).json({ error: "Failed to approve application" });
  }
};

export const rejectInfluencer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!id || !reason) {
      res.status(400).json({ error: "Application ID and reason are required" });
      return;
    }

    await rejectInfluencerApplication(Number(id), 1, reason);
    res.status(200).json({ message: "Application rejected successfully." });
  } catch (error) {
    console.error("Error rejecting influencer application:", error);
    res.status(500).json({ error: "Failed to reject application" });
  }
};

export const checkPendingApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const isPending = await getPendingApplicationByUserId(Number(userId));
    res.status(200).json({ isPending });
  } catch (error) {
    console.error("Error checking pending application:", error);
    res.status(500).json({ error: "Failed to check pending application" });
  }
};