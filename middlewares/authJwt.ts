/**
 * authJwt.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 * 설명: accessToken의 유효성을 검증하고, 필요에 따라 RefreshToken을 통한 accessToken의 재발급을 유도하는 JWT 토큰 관리 미들웨어 모듈입니다.
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

const JWT_SECRET: string = process.env.JWT_SECRET || `DEFAULT_JWT_SECRET`;
dotenv.config();

interface AuthenticatedRequest extends Request {
  userId?: number;
  influencerId?: number;
  username?: string;
}

export const verifyToken: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log(`req.headers verifytoken 1st: `, req.headers);

  //'x-access-token' 랑 'Bearer'를 둘 다 받을 수 있게 만든 코드
  let token: string | undefined;

  // 1) Authorization 헤더에서 Bearer 토큰 추출
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"에서 TOKEN만 추출
  }
  console.log(`Bear(er): `, token);

  // 2) x-access-token 헤더에서 토큰 추출
  if (!token && req.headers['x-access-token']) {
    token = req.headers['x-access-token'] as string;
  }
  console.log(`x-access-token: `, token);

  //두개를 다 적용했는데도 토큰이 없으면 401 에러 후 리턴
  if (!token) {
    res.status(401).json({
      status: 401,
      message: "Access Token is missing.",
    });
    return;
  }

  try {
    // 2. 엑세스 토큰 확인
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload; // accessToken 만료 시 이 부분에서 걸림

    req.userId = decoded.userId;
    req.influencerId = decoded.influencerId ? decoded.influencerId : null; // 이 부분은 논린이 있어 수정 가능성이 농후함(undefined로 수정해야 할 수도?)
    req.userId = decoded.userId;

    next(); // 다음 미들웨어로 전달
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).send({
        status: 401,
        message: "Access Token expired. Please refresh your token.",
      });
    } else {
      // 기타 인증 실패 에러 처리
      res.status(401).send({
        message: 'Unauthorized!',
        status: 401,
        error: err,
      });
    }
  }
};