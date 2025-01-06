/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               post_id:
 *                 type: integer
 *               parent_comment_id:
 *                 type: integer
 *               content:
 *                 type: string
 *             required:
 *               - user_id
 *               - post_id
 *               - content
 *     responses:
 *       '200':
 *         description: Comment created successfully
 *       '400':
 *         description: Missing required fields
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Comment details
 *       '400':
 *         description: Missing post ID
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the comment to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Comment deleted successfully
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /comment/{id}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the comment to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Comment updated successfully
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Internal server error
 */
