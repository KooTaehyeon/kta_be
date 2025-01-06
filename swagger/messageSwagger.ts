/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: 메시지 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 메시지 고유 ID
 *         room_id:
 *           type: integer
 *           description: 채팅방 ID
 *         user_id:
 *           type: integer
 *           description: 사용자 ID
 *         message_content:
 *           type: string
 *           description: 메시지 내용
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 메시지 생성 시간
 */

/**
 * @swagger
 * /message:
 *   get:
 *     summary: 모든 메시지 불러오기
 *     tags: [Messages]
 *     responses:
 *       '200':
 *         description: 모든 메시지 목록을 반환합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       '500':
 *         description: 서버 오류
 */


/**
 * @swagger
 * /message/room:
 *   get:
 *     summary: 메시지에서 유저 정보 불러오기
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: roomId
 *         required: true
 *         description: 채팅방 ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: true
 *         description: 페이지 번호
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: true
 *         description: 한 페이지당 항목 수
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 유저 정보 목록을 반환합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     description: 사용자 ID
 *                   userName:
 *                     type: string
 *                     description: 사용자 이름
 *                   messageContent:
 *                     type: string
 *                     description: 메시지 내용
 *       '500':
 *         description: 서버 오류
 */


/**
 * @swagger
 * /message:
 *   post:
 *     summary: 메시지 보내기
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_id:
 *                 type: integer
 *                 description: 채팅방 ID
 *               user_id:
 *                 type: integer
 *                 description: 사용자 ID
 *               message_content:
 *                 type: string
 *                 description: 메시지 내용
 *     responses:
 *       '201':
 *         description: 메시지 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '500':
 *         description: 서버 오류
 */
