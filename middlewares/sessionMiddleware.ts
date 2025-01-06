/**
 * sessionMiddleware.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 * 설명: 구글(Google) 소셜 로그인 시 필요한 req.session의 기본 설정을 위한 미들웨어 모듈입니다.
 */

import session from 'express-session';

import 'express-session';

// 오직 구글 소셜 로그인을 위한 세션처리
/**
 * Google 소셜 로그인을 위한 세션 미들웨어
 *
 * 이 미들웨어는 express-session을 사용하여 Google OAuth 인증 시 필요한 세션을 처리합니다.
 * 
 * @type {RequestHandler}
 * @property {string} secret - 세션을 암호화하기 위한 키 (환경변수 SESSION_SECRET 사용)
 * @property {boolean} resave - 세션이 변경되지 않은 경우에도 저장 여부 (기본값: false)
 * @property {boolean} saveUninitialized - 초기화되지 않은 세션도 저장 여부 (기본값: true)
 * @property {Object} cookie - 세션 쿠키 설정
 *   - {boolean} secure - 프로덕션 환경에서 HTTPS를 통해서만 쿠키 전송 (NODE_ENV에 따라 설정)
 *   - {number} maxAge - 세션 만료 시간 (1시간: 3600000ms)
 *
 * @example
 * import sessionMiddleware from './middlewares/sessionMiddleware';
 * app.use(sessionMiddleware);
 */
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // 환경변수 사용
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서 secure 설정
    maxAge: 3600000,
  },
});

export default sessionMiddleware;