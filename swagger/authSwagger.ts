
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 회원가입 및 로그인, 구글 로그인, 카카오 로그인을 관리하는 API
 */

/**
 * @swagger
 * /auth/signin/google:
 *   get:
 *     summary: Google OAuth 인증 시작
 *     description: 사용자를 Google 인증 페이지로 리다이렉트합니다.
 *     tags: [Auth]
 *     responses:
 *       '302':
 *         description: Google 인증 페이지로 리다이렉트
 *         headers:
 *           Location:
 *             description: Google 인증 URL
 *             schema:
 *               type: string
 *       '500':
 *         description: 내부 서버 오류
 */

/**
 * @swagger
 * /auth/signin/google/callback:
 *   get:
 *     summary: Google OAuth 인증 콜백
 *     description: Google에서 반환한 인증 코드를 사용하여 액세스 토큰을 발급받고, 사용자 정보를 처리합니다.
 *     tags: [Auth]
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         description: Google에서 제공한 인증 코드
 *         schema:
 *           type: string
 *       - name: state
 *         in: query
 *         required: true
 *         description: CSRF 방지를 위한 상태 값
 *         schema:
 *           type: string
 *     responses:
 *       '302':
 *         description: 인증 성공 후 클라이언트로 리다이렉트
 *         headers:
 *           Location:
 *             description: 클라이언트 리다이렉트 URL
 *             schema:
 *               type: string
 *       '400':
 *         description: 잘못된 요청 (이메일 정보 없음 또는 state 불일치)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일 정보가 없습니다."
 *                 status:
 *                   type: integer
 *                   example: 400
 *       '500':
 *         description: 내부 서버 오류
 */

/**
 * @swagger
 * /auth/signin/kakao:
 *   get:
 *     summary: Kakao OAuth 인증 시작
 *     description: 사용자를 Kakao 인증 페이지로 리다이렉트합니다.
 *     tags: [Auth]
 *     responses:
 *       '302':
 *         description: Kakao 인증 페이지로 리다이렉트
 *         headers:
 *           Location:
 *             description: Kakao 인증 URL
 *             schema:
 *               type: string
 *       '500':
 *         description: 서버에서 인증 URL 생성 실패
 */

/**
 * @swagger
 * /auth/signin/kakao/callback:
 *   get:
 *     summary: Kakao OAuth 인증 콜백
 *     description: Kakao에서 반환된 인증 코드를 사용하여 액세스 토큰을 발급받고 사용자 정보를 처리합니다.
 *     tags: [Auth]
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         description: Kakao에서 제공한 인증 코드
 *         schema:
 *           type: string
 *     responses:
 *       '302':
 *         description: 인증 성공 후 클라이언트로 리다이렉트
 *         headers:
 *           Location:
 *             description: 클라이언트 리다이렉트 URL
 *             schema:
 *               type: string
 *       '400':
 *         description: 인증 코드가 제공되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Authorization code is required"
 *       '500':
 *         description: 카카오 서버 또는 내부 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get token from Kakao"
 *                 details:
 *                   type: object
 *                   description: 카카오 API 오류 응답 데이터
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: 회원가입
 *     description: 새로운 사용자를 회원가입 처리합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 사용자 이름
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully!"
 *                 status:
 *                   type: integer
 *                   example: 201
 *       '500':
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: 로그인
 *     description: 사용자의 이메일과 비밀번호를 사용해 로그인 처리합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: 발급된 액세스 토큰
 *       '401':
 *         description: 비밀번호가 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Password."
 *                 status:
 *                   type: integer
 *                   example: 401
 *       '404':
 *         description: 사용자 정보를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User Not found."
 *                 status:
 *                   type: integer
 *                   example: 404
 *       '500':
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 로그아웃
 *     description: 사용자의 refreshToken 쿠키를 제거하고 로그아웃 처리합니다.
 *     tags: [Auth]
 *     responses:
 *       '200':
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful."
 *                 status:
 *                   type: integer
 *                   example: 200
 *       '500':
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 *                 error:
 *                   type: string
 */


/**
 * @swagger
 * /auth/refreshaccesstoken:
 *   get:
 *     summary: Access Token 재발급
 *     description: Refresh Token을 확인하고, 유효한 경우 새로운 Access Token을 발급합니다.
 *     tags: [Auth]
 *     parameters:
 *       - name: refreshToken
 *         in: cookie
 *         required: true
 *         description: 클라이언트에서 제공하는 Refresh Token
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Access Token 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: 새로 발급된 Access Token
 *       '401':
 *         description: Refresh Token이 만료되었거나 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh Token is expired."
 *                 status:
 *                   type: integer
 *                   example: 401
 *       '403':
 *         description: Refresh Token이 제공되지 않음 또는 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh Token is invalid or not provided."
 *                 status:
 *                   type: integer
 *                   example: 403
 *       '500':
 *         description: 내부 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 */