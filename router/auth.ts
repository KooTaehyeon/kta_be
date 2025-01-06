/**
 * auth.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 */

import { Router } from "express";
import { verifySignUp } from "../middlewares/verifySignUp";
import sessionMiddleware from "../middlewares/sessionMiddleware";
import cors from "cors"
import { logout, signin, signup } from "../controllers/auth/localAuthController";
import { getGoogleAuth, getGoogleAuthCallback } from "../controllers/auth/googleAuthController";
import { getKakaoAuth, getKakaoAuthCallback } from "../controllers/auth/kakaoAuthController";
import { refreshAccessToken } from "../controllers/auth/refreshAccessTokenController";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import clearBrowserCache from "../middlewares/clearBrowserCache";


dotenv.config();

const router = Router();
router.use(cookieParser())
const FRONTEND_URL = process.env.FRONTEND_URL || "DEFAULT_FRONTEND_URL";

// CORS 설정
const corsOptions = {
  origin: FRONTEND_URL, // 클라이언트 도메인
  credentials: true, // 쿠키 및 인증 헤더 허용
  methods: ['GET', 'POST', 'OPTIONS'], // 허용할 HTTP 메서드
};

// router.use(cors(corsOptions)); // 쿠키 파서 미들웨어 설정

// 회원가입 경로
router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  signup
);

// 로그인 경로
router.post("/signin", signin);
router.post("/refreshaccesstoken", cors(corsOptions), refreshAccessToken);
router.get("/signin/kakao/", cors(corsOptions), getKakaoAuth);
router.get("/signin/kakao/callback", cors(corsOptions), getKakaoAuthCallback);
router.get("/signin/google/", cors(corsOptions), sessionMiddleware, getGoogleAuth);
router.get("/signin/google/callback", cors(corsOptions), sessionMiddleware, getGoogleAuthCallback);
router.post("/logout", cors(corsOptions), clearBrowserCache, logout);

export { router };

