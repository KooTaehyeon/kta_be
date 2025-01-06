/**
 * accessController.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 * 설명: JWT 토큰 정상 작동을 위한 테스트 /access 페이지입니다. 검증용 모듈이라 배포 단계에서는 삭제를 목표로 하고 있습니다.
 */

//접근 권한 확인용 임시 경로

import { Request, Response } from "express";

export const allAccess = (req: Request, res: Response): void => {
  res.status(200).send("Public Content.");
};

export const userAccess = (req: Request, res: Response): void => {
  res.status(200).send("User Content.");
};
