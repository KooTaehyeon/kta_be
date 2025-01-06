/**
 * @swagger
 * tags:
 *   name: Feed
 *   description: Feed 관련 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Feed:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Feed ID
 *         influencer_id:
 *           type: integer
 *           description: 인플루언서 ID
 *         description:
 *           type: string
 *           description: Feed 내용
 *         visibility_level:
 *           type: string
 *           description: Feed 가시성
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Feed 이미지 URLs
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 description: 상품 이미지 URL
 *               title:
 *                 type: string
 *                 description: 상품 제목
 *               link:
 *                 type: string
 *                 description: 상품 링크
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: 좋아요한 사용자 IDs
 */

/**
 * @swagger
 * /feed/{id}:
 *   get:
 *     summary: 특정 Feed 조회
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 Feed ID
 *     responses:
 *       200:
 *         description: Feed 데이터 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feed'
 *       404:
 *         description: Feed를 찾을 수 없음
 *       400:
 *         description: 잘못된 Feed ID
 */

/**
 * @swagger
 * /feed:
 *   post:
 *     summary: Feed 생성
 *     tags: [Feed]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               grade:
 *                 type: string
 *               productImgs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               postImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Feed 생성 성공 메시지
 *       400:
 *         description: 필수 파일 누락 또는 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /feed/{id}:
 *   put:
 *     summary: Feed 수정
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 수정할 Feed ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               grade:
 *                 type: string
 *               productImgs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               postImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Feed 수정 성공 메시지
 *       404:
 *         description: Feed를 찾을 수 없음
 *       400:
 *         description: 잘못된 요청
 */

/**
 * @swagger
 * /feed/{id}:
 *   delete:
 *     summary: Feed 삭제
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 삭제할 Feed ID
 *     responses:
 *       200:
 *         description: Feed 삭제 성공 메시지
 *       404:
 *         description: Feed를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /feed/{id}/likes:
 *   post:
 *     summary: Feed 좋아요 추가/제거
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 좋아요 추가/제거할 Feed ID
 *     responses:
 *       200:
 *         description: 좋아요 상태 업데이트 성공
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: Feed를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /feed/{id}:
 *   get:
 *     summary: 특정 Feed 조회
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []  # 인증 추가
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 Feed ID
 *     responses:
 *       200:
 *         description: Feed 데이터 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feed'
 *       404:
 *         description: Feed를 찾을 수 없음
 *       401:
 *         description: 인증 실패
 *       400:
 *         description: 잘못된 Feed ID
 */
