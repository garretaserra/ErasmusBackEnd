import { Router } from 'express';

import {userRouter} from './user';
import {postRouter} from './post';
import {testRouter} from "./test";

let auth = require('./auth');

const router: Router = Router();

router.use('/user', auth.optional, userRouter);
router.use('/post', auth.optional, postRouter);
router.use('/test', auth.optional, testRouter)

export default router;
