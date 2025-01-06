/**
 * @swagger
 * tags:
 *   name: MembershipProducts
 *   description: 멤버십 상품을 관리하기 위한 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MembershipProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 멤버십 상품의 고유 ID
 *         name:
 *           type: string
 *           description: 멤버십 상품 이름
 *         price:
 *           type: number
 *           description: 멤버십 상품 가격
 *         benefits:
 *           type: string
 *           description: 멤버십 상품 혜택 설명
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: 멤버십 상품의 상태
 *         image:
 *           type: string
 *           description: 멤버십 상품 이미지 URL
 */

/**
 * @swagger
 * /membership/products/{userId}:
 *   get:
 *     summary: 인플루언서의 멤버십 상품 조회
 *     tags: [MembershipProducts]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: 멤버십 상품을 조회할 인플루언서의 user ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 사용자의 멤버십 상품 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MembershipProduct'
 *       '404':
 *         description: 멤버십 상품을 찾을 수 없음
 *       '500':
 *         description: 내부 서버 오류
 */

/**
 * @swagger
 * /membership/products/{productId}:
 *   patch:
 *     summary: 멤버십 상품 수정
 *     tags: [MembershipProducts]
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: 수정할 멤버십 상품의 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               benefits:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: 멤버십 상품이 성공적으로 수정됨
 *       '404':
 *         description: 멤버십 상품을 찾을 수 없음
 *       '500':
 *         description: 내부 서버 오류
 */

/**
 * @swagger
 * /membership/products:
 *   post:
 *     summary: 새로운 멤버십 상품 생성
 *     tags: [MembershipProducts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               benefits:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - name
 *               - price
 *               - benefits
 *     responses:
 *       '201':
 *         description: 멤버십 상품 생성 성공
 *       '400':
 *         description: 잘못된 입력
 *       '500':
 *         description: 내부 서버 오류
 */

/**
 * @swagger
 * /membership/products/{productId}:
 *   delete:
 *     summary: 멤버십 상품 삭제
 *     tags: [MembershipProducts]
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: 삭제할 멤버십 상품의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 멤버십 상품이 성공적으로 삭제됨
 *       '404':
 *         description: 멤버십 상품을 찾을 수 없음
 *       '500':
 *         description: 내부 서버 오류
 */

/**
 * @swagger
 * /membership/image:
 *   delete:
 *     summary: 멤버십 상품 이미지 삭제
 *     tags: [MembershipProducts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imagePath:
 *                 type: string
 *             required:
 *               - imagePath
 *     responses:
 *       '200':
 *         description: 멤버십 상품 이미지가 성공적으로 삭제됨
 *       '400':
 *         description: 잘못된 입력
 *       '500':
 *         description: 내부 서버 오류
 */

/**
 * @swagger
 * /membership/allproducts/{influencerId}:
 *   get:
 *     summary: 특정 인플루언서의 모든 멤버십 상품 조회
 *     tags: [MembershipProducts]
 *     parameters:
 *       - name: influencerId
 *         in: path
 *         required: true
 *         description: 멤버십 상품을 조회할 인플루언서의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 인플루언서의 모든 멤버십 상품 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MembershipProduct'
 *       '404':
 *         description: 멤버십 상품을 찾을 수 없음
 *       '500':
 *         description: 내부 서버 오류
 */

/**
 * @swagger
 * /membership/subscriptions/{userId}:
 *   get:
 *     summary: 특정 사용자의 활성화된 구독 목록 조회
 *     tags: [MembershipProducts]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: 구독 정보를 조회할 사용자의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 활성화된 구독 목록
 *       '404':
 *         description: 구독 정보를 찾을 수 없음
 *       '500':
 *         description: 내부 서버 오류
 */

/**
 * @swagger
 * /membership/subscribe:
 *   post:
 *     summary: 멤버십 상품 구독
 *     tags: [MembershipProducts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *             required:
 *               - user_id
 *               - product_id
 *     responses:
 *       '201':
 *         description: 구독이 성공적으로 생성됨
 *       '400':
 *         description: 잘못된 입력
 *       '500':
 *         description: 내부 서버 오류
 */
