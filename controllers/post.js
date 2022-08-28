import ApiError from '../error/index.js';
import post from '../service/post.js';
import uploadFile from '../service/uploadFile.js';

class PostController {
  create = async (req, res, next) => {
    try {
      const { title, tags, text, userId } = req.body;
      const file = req.files;
      const tagsArr = tags.split(',').map((i) => i.trim().toLowerCase());

      const uploadedFile = file ? await uploadFile.upload(file.img) : null;

      const postData = await post.create({
        title,
        text,
        tagsArr,
        userId,
        fileName: uploadedFile.id,
      });
      res.status(200).json(postData);
    } catch (error) {
      next(error);
    }
  };

  getAllPosts = async (req, res, next) => {
    try {
      const posts = await post.getAllPosts(req.query);
      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
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
    } catch (error) {
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

  getUserPosts = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user;
      const posts = await post.getUserPosts(id);
      res.json(posts);
    } catch (error) {
      next(error);
    }
  };

  likePost = async (req, res, next) => {
    try {
      const { id } = req.body;
      const user = req.user;
      const likesCount = await post.likePost(user.id, id);
      res.json(likesCount);
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req, res, next) => {
    try {
      const { title, tags, text, previewImage, id: postId, userId } = req.body;
      const { id } = req.params;
      const file = req.files;
      const user = req.user;

      if (id !== postId || user.id !== userId) {
        return next(ApiError.badRequest('Пост не найден'));
      }

      const tagsArr = tags.split(',').map((i) => i.trim().toLowerCase());

      const fileName = file ? await uploadFile.upload(file.img) : previewImage;

      const postData = await post.updatePosts({ title, text, id, fileName: fileName.id, tagsArr });
      res.json(postData);
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req, res, next) => {
    try {
      const { id } = req.body;
      const result = await post.deletePost(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
