/**
 * kakaoAuth.controller.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/27
 * 설명: 카카오(Kakao) 소셜 로그인 및 회원가입 유도를 관리하는 컨트롤러 모듈입니다.
 */

import { Request, Response } from "express";
import axios from "axios";
import { getUserInfluencerInfo, handleIssueToken, UserInfluencerInfo } from "../../util/auth";
import API_ENDPOINTS from "../../config/apiEndpoints";

const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID || "DEFAULT_KAKAO_CLIENT_ID";
// const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI || "DEFAULT_KAKAO_REDIRECT_URI";
const FRONTEND_URL = process.env.FRONTEND_URL || `DEFAULT_FRONTEND_URL`;
const KAKAO_REDIRECT_URI = API_ENDPOINTS.auth.kakaoRedirect;

/**
 * Kakao OAuth 인증을 시작하는 컨트롤러
 *
 * 사용자를 Kakao 로그인 페이지로 리다이렉트합니다.
 *
 * @param {Request} req - 클라이언트 요청 객체
 * @param {Response} res - 서버 응답 객체
 * @returns {void} Kakao 로그인 페이지로 리다이렉트
 *
 * @example
 * // 라우터에서 사용
 * router.get('/auth/kakao', getKakaoAuth);
 */
export const getKakaoAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const responseType = "code";
    const authUrl = `https://kauth.kakao.com/oauth/authorize?response_type=${responseType}&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      KAKAO_REDIRECT_URI
    )}`;

    res.redirect(authUrl);

  } catch (error: any) {
    console.error("Error generating Kakao Auth URL:", error.message);
    res.status(500).json({ error: "Failed to generate Kakao Auth URL" });
  }
};

/**
 * Kakao OAuth 인증 콜백 처리 컨트롤러
 *
 * Kakao에서 받은 인증 코드를 사용하여 액세스 토큰을 가져오고, 사용자 정보를 처리합니다.
 *
 * @param {Request} req - 클라이언트 요청 객체 (Kakao 인증 코드 포함)
 * @param {Response} res - 서버 응답 객체
 * @returns {void} 인증 성공 시 세션 생성 후 클라이언트로 리다이렉트
 *
 * @throws {Error} Kakao 인증 실패 또는 액세스 토큰 요청 실패
 *
 * @example
 * // 라우터에서 사용
 * router.get('/auth/kakao/callback', getKakaoAuthCallback);
 */
export const getKakaoAuthCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const code: any = req.query.code; // 클라이언트가 전달한 인증 코드
    if (!code) {
      res.status(400).json({ error: "Authorization code is required" });
      return;
    }

    // 요청 데이터
    const data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("client_id", KAKAO_CLIENT_ID);
    data.append("redirect_uri", KAKAO_REDIRECT_URI);
    data.append("code", code);

    // 카카오 토큰 발급 요청
    const tokenResponse = await axios.post("https://kauth.kakao.com/oauth/token", data.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    console.log(tokenResponse.data);

    const userInfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        "Authorization": `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    console.log(userInfo.data);

    const kakaoData = userInfo.data;
    const email = kakaoData.kakao_account?.email;

    const { user, influencer }: UserInfluencerInfo = await getUserInfluencerInfo(email);

    if (user) {
      const accessToken = handleIssueToken(req, res, user, influencer);
      const result = accessToken;

      // 사용자 정보 쿼리 문자열로 포함
      const queryString = new URLSearchParams(result as any).toString();
      const redirectUrl = `${FRONTEND_URL}/login/callback?${queryString}`;

      res.redirect(redirectUrl);
    } else {
      // 4. 이메일이 없음 -> 회원가입 페이지로 연동
      // 회원가입 페이지로 리다이렉트
      const redirectUrl = `${FRONTEND_URL}/register?email=${encodeURIComponent(email)}`;
      res.redirect(redirectUrl);
    }
  } catch (error: any) {
    console.error("Error during Kakao Token Request:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get token from Kakao", details: error.response?.data });
  }
};
