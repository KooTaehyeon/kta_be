/**
 * localAuth.controller.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/27
 * 리팩터링: 2024/12/06
 * 설명: 로컬 로그인(소셜 로그인이 아닌 것)의 회원가입 및 로그인을 관리하는 컨트롤러 모듈입니다.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../../models/user';
import {
  getUserInfluencerInfo,
  handleIssueToken,
  UserInfluencerInfo,
} from '../../util/auth';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    res.status(201).json({
      message: 'User registered successfully!',
      status: 201,
    });

  } catch (err: any) {
    console.error('Internal server error.', err);
    res.status(500).send({
      message: 'Internal server error.',
      error: err.message,
      status: 500,
    });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const email = req.body.email;
  try {
    const { user, influencer }: UserInfluencerInfo =
      await getUserInfluencerInfo(email);

    if (!user) {
      res.status(404).send({
        message: 'User Not found.',
        status: 404,
      });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      res.status(401).send({
        message: 'Invalid Password.',
        status: 401,
      });
      return;
    }

    const accessToken = handleIssueToken(req, res, user, influencer);
    res.status(200).send(accessToken);
    // res.status(200).send({
    //   message: 'Access token generated successfully.',
    //   status: 200,
    //   data: accessToken
    // });
  } catch (err: any) {
    console.error('Internal server error.', err);
    res.status(500).send({
      message: 'Internal server error.',
      error: err.message,
      status: 500,
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  console.log(`req.cookies.refreshToken: `, refreshToken);

  res.clearCookie('refreshToken', {
    httpOnly: true, // 오로지 백엔드에서만 수정 및 삭제가 가능함
    secure: false, // localhost에서 HTTPS 사용 안 함
    sameSite: 'lax', // Cross-Origin 요청 허용 (로그인 리다이렉트 등)
    path: '/', // 모든 경로에서 쿠키 삭제
  });

  console.log('refreshToken 삭제 완료');

  res.status(200).json({
    message: 'Logout successful.',
    status: 200,
  });
};
