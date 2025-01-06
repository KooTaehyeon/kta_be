// routes/commentRoutes.ts
import express from 'express';
import { verifyToken } from '../middlewares/authJwt';
import {
  postComment,
  getComment,
  deleteComment,
  updateComment,
} from '../controllers/commentController';

const router = express.Router();
router.post('/', verifyToken, postComment);
router.get('/:id', getComment);
router.delete('/:id', verifyToken, deleteComment);
router.patch('/:id', verifyToken, updateComment);

export { router };
