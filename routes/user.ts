import { Router } from 'express';
import userController from '../controllers/user';

const router: Router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

export default router;
