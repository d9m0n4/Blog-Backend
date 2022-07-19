import { Router } from 'express';
import PostController from '../controllers/post.js';
import TagsController from '../controllers/tags.js';
import UserController from '../controllers/user.js';
import { registerValidation } from '../validations/auth.js';
import auth from '../middleware/authHandler.js';
import CommentsController from '../controllers/comments.js';

const router = new Router();

const Routes = () => {
  const UserCtrl = new UserController();
  const PostCtrl = new PostController();
  const TagsCtrl = new TagsController();
  const CommentsCtrl = new CommentsController();

  router.post('/auth/registration', registerValidation, UserCtrl.registration);
  router.post('/auth/login', registerValidation, UserCtrl.login);
  router.post('/auth/logout', UserCtrl.logout);
  router.get('/auth/refresh', UserCtrl.refresh);

  router.get('/users/', UserCtrl.getUsers);

  router.post('/posts', PostCtrl.create);
  router.get('/posts', PostCtrl.getAllPosts);
  router.get('/posts/:id', PostCtrl.getPostById);
  router.get('/posts/tags/:tag', PostCtrl.getPostByTag);
  router.post('/posts/edit/:id', auth, PostCtrl.updatePost);

  router.get('/tags', TagsCtrl.getTags);

  router.post('/comments', CommentsCtrl.createComment);

  return router;
};

export default Routes;
