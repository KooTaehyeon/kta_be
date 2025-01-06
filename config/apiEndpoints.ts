/**
 * apiEndpoints.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/27
 * 설명: Auth 기능과 관련한 URL 엔드포인트를 한 곳에 모으기 위해 만든 파일입니다. 저 말고도 여기에 다른 기능의 엔드포인트를 추가하셔도 무방합니다.
 */

import * as dotenv from "dotenv";
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
/**
 * API_ENDPOINTS
 *
 * 모든 API 엔드포인트를 관리하는 객체입니다. 
 * 새로운 엔드포인트가 추가되면 이곳에 정의하세요.
 * 
 * @type {Object}
 * @property {string} base - 백엔드 기본 URL
 * @property {Object} auth - 인증 관련 엔드포인트 그룹
 * @property {string} auth.googleRedirect - Google 로그인 콜백 URL
 * @property {string} auth.kakaoRedirect - Kakao 로그인 콜백 URL
 * @property {string} auth.refreshAccessToken - 리프레시 토큰 URL
 * @property {string} auth.login - 로그인 URL
 * @property {string} auth.register - 회원가입 URL
 */
const API_ENDPOINTS = {
    base: BACKEND_URL,
    auth: {
      googleRedirect: `${BACKEND_URL}/auth/signin/google/callback`,
      kakaoRedirect: `${BACKEND_URL}/auth/signin/kakao/callback`,
      refreshAccessToken: `${BACKEND_URL}/auth/refreshaccesstoken`,
      login: `${BACKEND_URL}/auth/login`,
      register: `${BACKEND_URL}/auth/register`,
    },
  };

export default API_ENDPOINTS;