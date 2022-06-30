import ApiError from '../error/index.js';
import post from '../service/post.js';

class PostController {
  create = async (req, res, next) => {
    try {
      const { title, tags, text, userId } = req.body;
      const postData = await post.create(title, text, tags, userId);
      res.status(200).json(postData);
    } catch (error) {
      next(error);
    }
  };

  getAllPosts = async (req, res, next) => {
    try {
      const posts = await post.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  getPostById = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        next(ApiError.badRequest('Пост не найден'));
      }
      const postData = await post.getPostById(id);
      res.json(postData);
      console.log(id);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getPostByTag = async (req, res, next) => {
    try {
      const { tag } = req.params;
      const posts = await post.getPostByTag(tag);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
