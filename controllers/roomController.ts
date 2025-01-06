import { Request, Response } from 'express';
import * as roomService from "../services/roomService";
import { Room } from '../models/Room';
import { promises } from 'dns';
import { findFollowingsByUser } from '../services/userService';


// 모든 채팅방 불러오기
export const getRooms = async (req: Request, res: Response) => {
  const rooms = await Room.findAll();
  res.json(rooms);
};

//구독하고 있는 인플루언서 
export const getUserProfileByInfluencerId = async (req: Request, res: Response): Promise<void> => {
  try {
    const influencer = await roomService.getInfluencerDetails(Number(req.params.id));
    res.status(200).json(influencer);
  } catch (error) {
    console.error("사용자 정보 가져오기 오류:", error);
    res.status(500).json({ error: "사용자 정보를 가져오는 중 오류가 발생했습니다." });
  }
};

//팔로우 하고 있는 인플루언서
export const getFollowingsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const follwings = await findFollowingsByUser(Number(req.params.id))
    if (!follwings || follwings.length == 0) {
      res.status(200).json([]);
      return;
    }
    res.status(200).json(follwings);
  } catch (error) {
    console.log("팔로우한 인플루언서 가져오기 오류", error);
    res.status(500).json({
      error: "팔로우한 인플루언서 가져오는 중 오류가 발생했습니다.",
    });
  }
}

// 인플루언서 채팅방 생성
export const createRoom = async (req: Request, res: Response) => {
  try {

    const { roomName, influencerId, visibilityLevel } = req.body;

    const newRoom = await Room.create({
      room_name: roomName,
      influencer_id: influencerId,
      visibility_level: visibilityLevel || 1,
    });

    res.status(201).json({ sucess: true, data: newRoom });

  } catch (err) {
    console.log('err by create room', err);
    res.status(500).json({ success: false, message: 'failed to create room' })

  }
};




