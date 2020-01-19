import { Router } from 'express';

import {userRouter} from './user';
import {postRouter} from './post';
import {testRouter} from './test';
import {eventRouter} from './event';

let auth = require('./auth');

const router: Router = Router();

router.use('/user', auth.required, userRouter);
router.use('/post', auth.required, postRouter);
router.use('/event', auth.required, eventRouter);
router.use('/test', auth.optional, testRouter);

export default router;
