/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: 결제 확인을 위한 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentConfirmation:
 *       type: object
 *       properties:
 *         paymentId:
 *           type: string
 *           description: 결제를 식별하기 위한 고유 ID
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         amount:
 *           type: number
 *           format: float
 *           description: 결제 금액
 *         success:
 *           type: boolean
 *           description: 결제 확인 성공 여부
 *         message:
 *           type: string
 *           description: 처리 결과 메시지
 *         details:
 *           type: object
 *           additionalProperties: true
 *           description: 결제 상세 정보
 *       required:
 *         - paymentId
 *         - userId
 *         - amount
 */

/**
 * @swagger
 * /confirm:
 *   post:
 *     summary: 결제 확인
 *     description: 제공된 결제 정보를 바탕으로 결제를 확인합니다.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentConfirmation'
 *     responses:
 *       '200':
 *         description: 결제 확인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentConfirmation'
 *       '400':
 *         description: 잘못된 요청 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 요청 실패 여부
 *                 error:
 *                   type: string
 *                   description: 오류 메시지
 *       '500':
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 요청 실패 여부
 *                 error:
 *                   type: string
 *                   description: 오류 메시지
 */
