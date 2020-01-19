import { Router } from 'express';

import {userRouter} from './user';
import {postRouter} from './post';
import {testRouter} from './test';
import {eventRouter} from './event';
import {universityRouter} from "./university";

let auth = require('./auth');

const router: Router = Router();

router.use('/user', auth.optional, userRouter);
router.use('/post', auth.optional, postRouter);
router.use('/event', auth.optional, eventRouter);
router.use('/university', auth.optional, universityRouter);
router.use('/test', auth.optional, testRouter);

export default router;
