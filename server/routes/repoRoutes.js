import { Router } from 'express';
import { analyzeRepo, explainCode, debug, chatFile } from '../controllers/repoController.js';

const router = Router();

router.post('/analyze-repo', analyzeRepo);
router.post('/explain-code', explainCode);
router.post('/debug', debug);
router.post('/chat-file', chatFile);

export default router;