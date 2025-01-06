import express from "express";
import {
  getNotifications,
  deleteNotification,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/:userId", getNotifications);
router.delete("/:notificationId", deleteNotification);

export { router };
