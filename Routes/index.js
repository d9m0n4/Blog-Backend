import { Router } from 'express';
import PostController from '../controllers/post.js';
import TagsController from '../controllers/tags.js';
import UserController from '../controllers/user.js';
import { registerValidation } from '../validations/auth.js';

const router = new Router();

const Routes = () => {
  const UserCtrl = new UserController();
  const PostCtrl = new PostController();
  const TagsCtrl = new TagsController();

  router.post('/auth/registration', registerValidation, UserCtrl.registration);
  router.post('/auth/login', registerValidation, UserCtrl.login);

  router.post('/posts', PostCtrl.create);
  router.get('/posts', PostCtrl.getAllPosts);
  router.get('/posts/:id', PostCtrl.getPostById);
  router.get('/posts/tags/:tag', PostCtrl.getPostByTag);
  router.post('/posts/edit/:id', PostCtrl.updatePost);

  router.get('/tags', TagsCtrl.getTags);
  router;

  return router;
};

export default Routes;
