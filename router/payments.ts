import express from "express";
import { confirmPaymentController, savePaymentInfoController, getPaymentsController } from "../controllers/paymentController";

const router = express.Router();

router.get("/list", getPaymentsController); // 결제 목록 조회
router.post("/confirm", confirmPaymentController); // 결제 승인
router.post("/save", savePaymentInfoController); // 결제 정보 저장

export { router };
