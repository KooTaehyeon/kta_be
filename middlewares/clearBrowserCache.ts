/**
 * clearBrowserCache.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/29
 */

import { NextFunction, Request, Response } from "express";

//Browser Cache를 명시적으로 삭제하는 코드(RefreshToken 삭제 시 캐싱 방지)
const clearBrowserCache = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

export default clearBrowserCache;