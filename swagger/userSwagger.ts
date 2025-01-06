/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 사용자 고유 ID
 *         name:
 *           type: string
 *           description: 사용자 이름
 *         email:
 *           type: string
 *           description: 사용자 이메일 주소
 *         profilePicture:
 *           type: string
 *           description: 사용자 프로필 사진 URL
 *         followers:
 *           type: array
 *           items:
 *             type: integer
 *           description: 팔로워 ID 목록
 *     Feed:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 피드 고유 ID
 *         content:
 *           type: string
 *           description: 피드 내용
 *         likes:
 *           type: integer
 *           description: 피드 좋아요 수
 *         authorId:
 *           type: integer
 *           description: 작성자 ID
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: 사용자 정보 조회
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 조회할 사용자의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 사용자 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: 사용자 정보를 찾을 수 없음
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: 사용자 정보 업데이트
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 업데이트할 사용자의 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: 사용자 정보 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: 잘못된 요청 데이터
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /user/{id}/likes:
 *   get:
 *     summary: 사용자가 좋아요한 피드 조회
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 조회할 사용자의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 사용자가 좋아요한 피드 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feed'
 *       '404':
 *         description: 좋아요한 피드 없음
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /user/{id}/follows:
 *   get:
 *     summary: 사용자가 팔로우한 인플루언서 조회
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 조회할 사용자의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 사용자가 팔로우한 인플루언서 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   influencerId:
 *                     type: integer
 *                     description: 인플루언서 ID
 *                   name:
 *                     type: string
 *                     description: 인플루언서 이름
 *       '404':
 *         description: 팔로우한 인플루언서 없음
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /user/{id}/feeds:
 *   get:
 *     summary: 사용자가 작성한 피드 조회
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 조회할 사용자의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 사용자가 작성한 피드 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feed'
 *       '404':
 *         description: 작성한 피드 없음
 *       '500':
 *         description: 서버 오류
 */
