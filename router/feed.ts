import express from 'express';
import {
  FeedWrite,
  FeedGetById,
  FeedUpdate,
  FeedDelete,
  FeedLikes,
  AdminFeedGetAll,
} from '../controllers/feedController';
import { verifyToken } from '../middlewares/authJwt';

const router = express.Router();

// 라우트에서 upload 미들웨어 먼저 실행
router.post('/', verifyToken, FeedWrite); // 작성
router.get('/:id', FeedGetById); // 상세게시글
router.patch('/:id', verifyToken, FeedUpdate); // 수정
router.delete('/:id', verifyToken, FeedDelete); // 삭제
router.patch('/likes/:id', verifyToken, FeedLikes); // 좋아요
// 어드민
router.get('/admin/all', AdminFeedGetAll);
router.patch('/admin/:id', FeedUpdate);
router.delete('/admin/:id', FeedDelete); // 삭제
export { router };
