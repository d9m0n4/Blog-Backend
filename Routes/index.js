import { Router } from 'express';
import UserController from '../controllers/user.js';
import { registerValidation } from '../validations/auth.js';

const router = new Router();

const Routes = () => {
  const UserCtrl = new UserController();
  router.post('/auth/registration', registerValidation, UserCtrl.registration);
  return router;
};

export default Routes;
