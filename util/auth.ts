/**
 * auth.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/27
 * 설명: 로그인 및 회원가입 컨트롤러 전반에서 중복되는 기능을 함수로 만들어 관리하는 유틸 모듈입니다.
 */

import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User, UserAttributes } from '../models/user';
import { Influencer, InfluencerAttributes } from '../models/influencer';
import { config } from 'dotenv';
config();

// /**
//  * 사용자 정보를 포맷팅하여 클라이언트에 반환할 객체를 생성합니다.
//  *
//  * @param {UserAttributes} user - 데이터베이스에서 조회한 사용자 정보
//  * @param {InfluencerAttributes} influencer - 데이터베이스에서 조회한 인플루언서 정보 (선택)
//  * @param {string} token - 발급된 액세스 토큰
//  * @returns {Object} 포맷된 사용자 응답 객체
//  *
//  * @example
//  * const response = formatUserResponse(user, influencer, token);
//  * console.log(response); // { id: 1, username: "john", email: "john@example.com", ... }
//  */
export const formatUserResponse = (user: any, influencer: any) => {
  const result: Record<string, any> = {
    userId: user.id,
    username: user.username,
  };

  // influencer가 존재하면 동적으로 속성 추가
  if (influencer) {
    result.influencerId = influencer.id || null;
  }
  return result;
};

/**
 * 리프레시 토큰을 쿠키에 저장합니다.
 *
 * @param {Request} req - 클라이언트 요청 객체
 * @param {Response} res - 서버 응답 객체
 * @param {string} refreshToken - 저장할 리프레시 토큰
 * @returns {void} 반환값 없음
 *
 * @example
 * saveRefreshTokenInCookie(req, res, "your-refresh-token");
 */
const saveRefreshTokenInCookie = (
  req: Request,
  res: Response,
  refreshToken: string
) => {
  // 기존 refreshToken 삭제
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // localhost에서 HTTPS 사용 안 함
    sameSite: 'lax', // Cross-Origin 요청 허용 (로그인 리다이렉트 등)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    // path: "/auth/refreshToken", // 특정 경로에서만 쿠키 사용
    path: '/', // 모든 경로에서 쿠키 허용
  });
};

/**
 * 사용자의 정보와 관련된 인플루언서 정보를 조회합니다.
 *
 * @param {string} userEmailVerify - 조회할 사용자의 이메일
 * @returns {Promise<UserInfluencerInfo>} 사용자와 인플루언서 정보를 포함한 객체
 *
 * @example
 * const { user, influencer } = await getUserInfluencerInfo("user@example.com");
 */
export const getUserInfluencerInfo = async (userEmailVerify: string) => {
  const user = (await User.findOne({
    where: { email: userEmailVerify },
    raw: true, // 순수 데이터 객체 반환
  })) as UserAttributes | null; // 반환 타입 명시

  const influencer = user
    ? ((await Influencer.findOne({
        where: { user_id: user.id },
        raw: true, // 순수 데이터 객체 반환
      })) as InfluencerAttributes | null)
    : null;

  return { user, influencer };
};

/**
 * JWT를 생성합니다.
 *
 * @param {number} userId - JWT에 포함될 사용자 ID
 * @param {string} secretKey - JWT를 서명할 비밀 키
 * @param {string | number} expiresIn - 토큰 만료 시간 (예: "1h", 3600)
 * @returns {string} 생성된 JWT 문자열
 *
 * @example
 * const token = generateToken(1, "your-secret-key", "1h");
 * console.log(token); // eyJhbGciOiJIUzI1NiIsInR...
 */
export const generateToken = (
  tokenData: any,
  secretKey: string,
  expiresIn: string | number
): string => {
  return jwt.sign(tokenData, secretKey, {
    algorithm: 'HS256',
    expiresIn: expiresIn, // 동적으로 유효기간 설정
  });
};

export interface UserInfluencerInfo {
  user: UserAttributes | null;
  influencer: InfluencerAttributes | null;
}

export const handleIssueToken = (
  req: Request,
  res: Response,
  user: UserAttributes | null,
  influencer?: InfluencerAttributes | null
) => {
  const tokenData = formatUserResponse(user, influencer);

  const accessToken = generateToken(tokenData, process.env.JWT_SECRET!, '5m');
  const refreshToken = generateToken(
    tokenData,
    process.env.JWT_REFRESH_SECRET!,
    '7d'
  );

  const result = { accessToken };

  // 쿠키에 refresh token 저장
  saveRefreshTokenInCookie(req, res, refreshToken);
  console.log(`accessToken: `, result); //엑세스 토큰 잘 나오는지 검사

  return result;
};
