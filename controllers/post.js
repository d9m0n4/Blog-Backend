import ApiError from '../error/index.js';
import post from '../service/post.js';
import path from 'path';
import * as uuid from 'uuid';

class PostController {
  fileName = (img) => {
    const filenameid = uuid.v4();
    const filename = filenameid + img.name;
    const __dirname = path.resolve(path.dirname(''));
    img.mv(path.resolve(__dirname, 'static', filename));
    return filename;
  };

  file = async (req, res, next) => {
    try {
      console.log(req.file, req.body);
    } catch (error) {
      console.log(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const { title, tags, text, userId } = req.body;
      const file = req.files;
      const tagsArr = tags.split(',').map((i) => i.trim());

      let fileName;
      if (file) {
        fileName = this.fileName(file.img);
      }
      const postData = await post.create(title, text, tagsArr, userId, fileName);
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

  updatePost = async (req, res, next) => {
    try {
      const { title, tags, text } = req.body;
      const { id } = req.params;
      const file = req.files;
      let filename;
      if (file) {
        filename = this.fileName(file.img);
      }

      const postData = await post.updatePosts(title, text, id, filename, tags);
      res.json(postData);
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
