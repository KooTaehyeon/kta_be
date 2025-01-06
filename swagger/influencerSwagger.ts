/**
 * @swagger
 * tags:
 *   name: Influencers
 *   description: 인플루언서를 관리하기 위한 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Influencer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 인플루언서의 고유 ID
 *         name:
 *           type: string
 *           description: 인플루언서의 이름
 *         category:
 *           type: string
 *           description: 인플루언서의 카테고리
 *         banner_picture:
 *           type: string
 *           description: 인플루언서의 배너 이미지 URL
 *         follower:
 *           type: array
 *           items:
 *             type: integer
 *           description: 팔로워 ID 리스트
 */

/**
 * @swagger
 * /influencer/all:
 *   get:
 *     summary: 모든 인플루언서 조회
 *     tags: [Influencers]
 *     responses:
 *       '200':
 *         description: 모든 인플루언서 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Influencer'
 *       '500':
 *         description: 인플루언서 조회 실패
 */

/**
 * @swagger
 * /influencer/{id}:
 *   get:
 *     summary: 특정 인플루언서 상세 조회
 *     tags: [Influencers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 조회할 인플루언서의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 인플루언서 상세 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Influencer'
 *       '500':
 *         description: 인플루언서 조회 실패
 */

/**
 * @swagger
 * /influencer/user/{id}:
 *   get:
 *     summary: 사용자 ID로 인플루언서 정보 조회
 *     tags: [Influencers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 조회할 사용자의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 사용자와 연결된 인플루언서 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Influencer'
 *       '500':
 *         description: 인플루언서 조회 실패
 */

/**
 * @swagger
 * /influencer/follow:
 *   post:
 *     summary: 특정 인플루언서 팔로우 또는 언팔로우
 *     tags: [Influencers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *               influencerId:
 *                 type: integer
 *                 description: 인플루언서 ID
 *             required:
 *               - userId
 *               - influencerId
 *     responses:
 *       '200':
 *         description: 팔로우 상태가 성공적으로 변경되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *       '500':
 *         description: 팔로우 상태 변경 실패
 */

/**
 * @swagger
 * /influencer/register:
 *   post:
 *     summary: 새로운 인플루언서 등록
 *     tags: [Influencers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Influencer'
 *     responses:
 *       '201':
 *         description: 인플루언서 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Influencer'
 *       '400':
 *         description: 필수 필드 누락
 *       '500':
 *         description: 인플루언서 등록 실패
 */

/**
 * @swagger
 * /influencer/{id}:
 *   delete:
 *     summary: 특정 인플루언서 삭제
 *     tags: [Influencers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 삭제할 인플루언서의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: 인플루언서 삭제 성공
 *       '400':
 *         description: 잘못된 인플루언서 ID
 *       '500':
 *         description: 인플루언서 삭제 실패
 */
