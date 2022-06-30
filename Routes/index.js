import { Router } from 'express';
import PostController from '../controllers/post.js';
import UserController from '../controllers/user.js';
import { registerValidation } from '../validations/auth.js';

const router = new Router();

const Routes = () => {
  const UserCtrl = new UserController();
  const PostCtrl = new PostController();

  router.post('/auth/registration', registerValidation, UserCtrl.registration);
  router.post('/auth/login', registerValidation, UserCtrl.login);

  router.post('/posts', PostCtrl.create);
  router.get('/posts', PostCtrl.getAllPosts);

  return router;
};

export default Routes;
