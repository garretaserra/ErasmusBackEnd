import { Router } from 'express';
import {userRouter} from './user';
let auth = require('./auth');
const router: Router = Router();

router.use('/user', auth.optional, userRouter);

export default router;
