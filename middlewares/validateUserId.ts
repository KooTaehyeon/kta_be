import { Request, Response, NextFunction } from 'express';

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).json({ error: '사용자 ID가 제공되지 않았습니다.' });
    return;
  }
  next();
};
