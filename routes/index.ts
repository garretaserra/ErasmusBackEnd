import { Router } from 'express';
import userRouter from './user';

const router: Router = Router();

router.use('/api', require('./api'));
router.use('/user', userRouter);

export default router;
