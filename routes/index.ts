import { Router } from 'express';
import {userRouter} from './user';
import {postRouter} from './post';
let auth = require('./auth');
const router: Router = Router();

router.use('/user', auth.optional, userRouter);
router.use('/post', auth.optional, postRouter);

export default router;
