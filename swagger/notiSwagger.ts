/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: 사용자 알림을 관리하기 위한 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 알림의 고유 ID
 *         message:
 *           type: string
 *           description: 알림 메시지 내용
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 알림 생성 날짜 및 시간
 *         success:
 *           type: boolean
 *           description: 성공 여부
 */

/**
 * @swagger
 * /noti/{userId}:
 *   get:
 *     summary: 특정 사용자의 알림 목록 조회
 *     tags: [Notifications]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: 알림을 조회할 사용자의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 사용자의 알림 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 요청 성공 여부
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       '500':
 *         description: 알림 조회 실패
 */

/**
 * @swagger
 * /noti/{notificationId}:
 *   delete:
 *     summary: 특정 알림 삭제
 *     tags: [Notifications]
 *     parameters:
 *       - name: notificationId
 *         in: path
 *         required: true
 *         description: 삭제할 알림의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 알림이 성공적으로 삭제됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 요청 성공 여부
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *       '500':
 *         description: 알림 삭제 실패
 */
