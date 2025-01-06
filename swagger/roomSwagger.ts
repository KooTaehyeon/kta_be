/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: 채팅방 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 채팅방 고유 ID
 *         room_name:
 *           type: string
 *           description: 채팅방 이름
 *         influencer_id:
 *           type: integer
 *           description: 인플루언서 ID
 *         visibility_level:
 *           type: integer
 *           description: 채팅방 공개 수준
 */

/**
 * @swagger
 * /room:
 *   get:
 *     summary: 모든 채팅방 불러오기
 *     tags: [Rooms]
 *     responses:
 *       '200':
 *         description: 채팅방 목록을 반환합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /room/influencer/{id}:
 *   get:
 *     summary: 특정 인플루언서 정보 조회
 *     tags: [Rooms]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 인플루언서의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 인플루언서 정보
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /room/follwing/{id}:
 *   get:
 *     summary: 사용자가 팔로우한 인플루언서 정보 조회
 *     tags: [Rooms]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 사용자의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 팔로우한 인플루언서 목록
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
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /room:
 *   post:
 *     summary: 인플루언서 채팅방 생성
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomName:
 *                 type: string
 *                 description: 채팅방 이름
 *               influencerId:
 *                 type: integer
 *                 description: 인플루언서 ID
 *               visibilityLevel:
 *                 type: integer
 *                 description: 공개 수준 (1: 기본값)
 *     responses:
 *       200:
 *         description: 인플루언서 채팅방 생성 메시지
 *       400:
 *         description: 필수 파일 누락 또는 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

