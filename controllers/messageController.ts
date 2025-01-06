import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { getMessageByroomUserInfo, uploadImage, deleteMessage } from "../services/messageService";


//모든 메세지 불러오기
export const getMessages = async (req: Request, res: Response) => {
  const Messages = await Message.findAll();
  res.json(Messages);
};


//메세지에서 유저 정보를 불러오기
export const getMessageUerInfo = async (req: Request<{ roomId: string, page: string, limit: string }>, res: Response): Promise<void> => {
  try {
    const roomId = parseInt(req.query.roomId as string);
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const offset = (page - 1) * limit;

    console.log("roomId:---------------------", roomId);
    console.log("page:---------------------", page);
    console.log("limit:---------------------", limit);
    console.log("offset:---------------------", offset);

    const result = await getMessageByroomUserInfo(roomId, limit, offset);

    res.status(200).json(result);
  } catch (error) {
    console.error("멤버쉽 유저 정보 가져오기 오류:", error);
    res.status(500).json({ error: "멤버쉽 유저 정보 가져오기 오류." });
  }
};


//메세지 보낼때 
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { room_id, user_id, message_content } = req.body;
    const newMessage = await Message.create({
      room_id: room_id,
      user_id: user_id,
      message_content: message_content,
    });

    res.status(201).json({ success: true, data: newMessage });

  } catch (err) {
    console.log('err by create Message', err);
    res.status(500).json({ success: false, message: 'failed to Message room' })

  }
};

export const uploadImageController = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).send('No file uploaded.');
    }
    if (file) {
      const url = await uploadImage(file);
      res.status(200).json({ url });
    }
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send('Error uploading file.');
  }
};

export const deleteMessageController = async (req: Request, res: Response) => {
  try {
    const { id, key } = req.body;
    await deleteMessage(id, key);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).send('Error deleting message.');
  }
};



