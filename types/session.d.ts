/**
 * session.d.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 * 설명: 구글(Google) 소셜 로그인 시 필요한 req.session은 state 속성이 없으므로, 이를 프로젝트 내에 추가해주는 모듈입니다. 사용 시 백엔드 루트 경로의 'tsconfig.json'의 "compilerOptions" 속성의 내부 속성으로 별도의 경로 지정 코드("typeRoots": ["./types", "./node_modules/@types"])를 추가해야 합니다.
 */

import 'express-session';

declare module 'express-session' {
  interface Session {
    state?: string; // state 속성 추가
  }
}