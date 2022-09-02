import { Router } from 'express';
import PostController from '../controllers/post.js';
import TagsController from '../controllers/tags.js';
import UserController from '../controllers/user.js';
import { registerValidation } from '../validations/auth.js';
import CommentsController from '../controllers/comments.js';
import authHandler from '../middleware/authHandler.js';
import UploadController from '../controllers/upload.js';

const router = new Router();

const Routes = () => {
  const UserCtrl = new UserController();
  const PostCtrl = new PostController();
  const TagsCtrl = new TagsController();
  const CommentsCtrl = new CommentsController();
  const UploadCtrl = new UploadController();

  router.post('/auth/registration', registerValidation, UserCtrl.registration);
  router.post('/auth/login', registerValidation, UserCtrl.login);
  router.post('/auth/logout', UserCtrl.logout);
  router.get('/auth/refresh', UserCtrl.refresh);

  router.get('/users/', UserCtrl.getUsers);
  router.post('/users/update', authHandler, UserCtrl.updateUserInfo);
  router.get('/users/:id', UserCtrl.getCurrentUser);

  router.post('/posts', authHandler, PostCtrl.create);
  router.post('/posts/like', authHandler, PostCtrl.likePost);
  router.get('/posts', PostCtrl.getAllPosts);
  router.get('/posts/popular', PostCtrl.getPopularPosts);
  router.get('/posts/:id', PostCtrl.getPostById);
  router.get('/posts/user/:id', PostCtrl.getUserPosts);
  router.get('/posts/tags/:tag', PostCtrl.getPostByTag);
  router.post('/posts/edit/:id', authHandler, PostCtrl.updatePost);
  router.post('/posts/delete', authHandler, PostCtrl.deletePost);

  router.get('/tags', TagsCtrl.getTags);

  router.post('/comments', authHandler, CommentsCtrl.createComment);
  router.get('/comments/user/:id', CommentsCtrl.getUserComments);

  router.post('/upload', authHandler, UploadCtrl.uploadFiles);

  return router;
};

export default Routes;
