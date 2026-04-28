import { Router } from 'express';
import { analyzeCode } from '../controllers/analysis.controller.js';

const router = Router();

router.post('/', analyzeCode);

export default router;
