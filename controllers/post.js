import post from '../service/post.js';

class PostController {
  create = async (req, res, next) => {
    try {
      const { title, tags, text, userId } = req.body;
      const postData = await post.create(title, text, tags, userId);
      res.status(200).json(postData);
    } catch (error) {
      console.log(error);
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
}

export default PostController;
