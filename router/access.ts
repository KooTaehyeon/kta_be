/**
 * user.routes.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 */

import { Router } from "express";
import { verifyToken } from "../middlewares/authJwt";
import * as controller from "../controllers/accessController";
import cookieParser from "cookie-parser";

const router = Router();
router.use(cookieParser());

// 공통 헤더 설정
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// 모든 사용자 접근 가능
router.get("/all", controller.allAccess);

// 인증된 사용자만 접근 가능
router.get("/user", verifyToken, controller.userAccess);

export { router };

