import express from 'express';
import multer from 'multer';
import { getMessages, createMessage, getMessageUerInfo, uploadImageController, deleteMessageController } from '../controllers/messageController';

const router = express.Router();
const upload = multer();

router.get('/', getMessages);
router.get('/room', getMessageUerInfo);
router.post('/', createMessage);
router.post('/upload', upload.single('file'), uploadImageController);
router.post('/delete', deleteMessageController);

export { router };