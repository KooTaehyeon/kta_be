import { Request, Response } from "express";
import {
  deleteNotificationById,
  getNotificationsByUserId,
} from "../services/notificationService";

export const getNotifications = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const notifications = await getNotificationsByUserId(Number(userId));
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("알림 조회 중 오류:", error);
    res.status(500).json({ success: false, message: "알림 조회 실패" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    try {
      await deleteNotificationById(Number(notificationId));
      res.status(200).json({ success: true, message: "알림이 삭제됐습니다." });
    } catch (error) {
      console.error("알림 삭제 중 오류:", error);
      res.status(500).json({ success: false, message: "알림 삭제 실패" });
    }
  } catch (error) {}
};
