import ApiError from '../error/index.js';
import post from '../service/post.js';

import { createFileName } from '../utils/index.js';

class PostController {
  create = async (req, res, next) => {
    try {
      const { title, tags, text, userId } = req.body;
      const file = req.files;
      const tagsArr = tags.split(',').map((i) => i.trim().toLowerCase());

      let fileName;
      if (file) {
        fileName = createFileName(file.img);
      }
      const postData = await post.create(title, text, tagsArr, userId, fileName);
      res.status(200).json(postData);
    } catch (error) {
      next(error);
    }
  };

  getAllPosts = async (req, res, next) => {
    try {
      const posts = await post.getAllPosts(req.query.query);
      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  searchPosts = async (req, res, next) => {
    try {
      const posts = await post.searchPosts(req.query.query);
      console.log(posts);
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
      console.log(error);
      next(error);
    }
  };

  getUserPosts = async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      const userId = req.user;
      const posts = await post.getUserPosts(id);
      res.json(posts);
    } catch (error) {
      console.log(error);
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
