import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';

const router = express.Router();

router.get('/', getDashboardStats); // 작성

export { router };
