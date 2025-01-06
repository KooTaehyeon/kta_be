import express from 'express';
import { getRooms, createRoom, getUserProfileByInfluencerId, getFollowingsByUser } from '../controllers/roomController';

const router = express.Router();

router.get('/', getRooms); //모든 채팅룸 호출
router.post('/', createRoom); //채팅방 생성
router.get('/influencer/:id', getUserProfileByInfluencerId); //구독하고 있는 인플루언서정보 호출
router.get('/follwing/:id', getFollowingsByUser); //구독하고 있는 인플루언서정보 호출

export { router };