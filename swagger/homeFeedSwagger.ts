/**
 * @swagger
 * tags:
 *   name: Home Feed
 *   description: Home Feed 관련 API
 */

/**
 * @swagger
 * /homefeed/postcurrentloggedinuserinfo:
 *   post:
 *     summary: 현재 로그인한 사용자 정보 가져오기
 *     description: 로그인된 사용자의 ID를 통해 유저 정보를 조회합니다.
 *     tags: [Home Feed]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: 유저 ID
 *                 example: 1
 *     responses:
 *       '200':
 *         description: 유저 정보 반환
 *       '404':
 *         description: 유저 정보를 찾을 수 없음
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /homefeed/getfeeds:
 *   get:
 *     summary: 피드 가져오기
 *     description: 피드 데이터를 페이지네이션으로 가져옵니다.
 *     tags: [Home Feed]
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: 가져올 피드의 최대 개수
 *       - name: offset
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: 시작할 피드의 인덱스
 *     responses:
 *       '200':
 *         description: 피드 데이터 반환
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /homefeed/postfeeddatatoinfluencerdata:
 *   post:
 *     summary: 피드 데이터를 인플루언서 정보로 매핑
 *     description: 주어진 ID로 인플루언서 정보를 조회합니다.
 *     tags: [Home Feed]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: 인플루언서 ID
 *                 example: 2
 *     responses:
 *       '200':
 *         description: 인플루언서 정보 반환
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /homefeed/patchuserfollow:
 *   patch:
 *     summary: 유저 팔로우 정보 수정
 *     description: 특정 사용자의 팔로우 상태를 추가하거나 제거합니다.
 *     tags: [Home Feed]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: 유저 ID
 *               influencerId:
 *                 type: integer
 *                 description: 인플루언서 ID
 *               isFollowing:
 *                 type: boolean
 *                 description: 팔로우 여부
 *     responses:
 *       '200':
 *         description: 팔로우 상태가 성공적으로 업데이트됨
 *       '404':
 *         description: 유저 정보를 찾을 수 없음
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /homefeed/patchfeedlikes:
 *   patch:
 *     summary: 피드 좋아요 정보 수정
 *     description: 특정 피드의 좋아요 목록을 수정합니다.
 *     tags: [Home Feed]
 *     parameters:
 *       - name: feedId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 피드 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               likes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 좋아요 사용자 ID 배열
 *     responses:
 *       '200':
 *         description: 좋아요 상태가 성공적으로 업데이트됨
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /homefeed/postinfluencerusernameinfo:
 *   post:
 *     summary: 인플루언서 사용자 이름 정보 가져오기
 *     description: 인플루언서 ID를 통해 사용자 정보를 가져옵니다.
 *     tags: [Home Feed]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               influencerId:
 *                 type: integer
 *                 description: 인플루언서 ID
 *                 example: 3
 *     responses:
 *       '200':
 *         description: 사용자 정보 반환
 *       '404':
 *         description: 사용자 정보를 찾을 수 없음
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /homefeed/postuseridbyinfluencerid:
 *   post:
 *     summary: 인플루언서 ID로 사용자 ID 조회
 *     description: 인플루언서 ID를 통해 사용자 ID를 조회합니다.
 *     tags: [Home Feed]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               influencerId:
 *                 type: integer
 *                 description: 인플루언서 ID
 *                 example: 4
 *     responses:
 *       '200':
 *         description: 사용자 ID 반환
 *       '404':
 *         description: 데이터를 찾을 수 없음
 *       '500':
 *         description: 서버 오류
 */

/**
 * @swagger
 * /homefeed/postusernamebyuserid:
 *   post:
 *     summary: 사용자 ID로 사용자 이름 조회
 *     description: 사용자 ID를 통해 사용자 이름을 조회합니다.
 *     tags: [Home Feed]
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
 *                 example: 5
 *     responses:
 *       '200':
 *         description: 사용자 이름 반환
 *       '404':
 *         description: 데이터를 찾을 수 없음
 *       '500':
 *         description: 서버 오류
 */