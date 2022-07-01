import { Op } from 'sequelize';
import PostDto from '../dtos/postDto.js';
import UserDto from '../dtos/userDto.js';
import ApiError from '../error/index.js';
import { Comment, Post, Tag, User } from '../models/models.js';

class PostService {
  convertePosts = (posts) => {
    return posts.map((post) => {
      const postItem = new PostDto(post);
      const postUser = new UserDto(post.user);
      const { items } = post.tags;
      return { ...postItem, user: postUser, tags: [...items] };
    });
  };

  create = async (title, text, tags, userId, fileName) => {
    try {
      const post = await Post.create({ title, text, userId, previewImage: fileName });
      const postTags = await Tag.create({ items: tags, postId: post.id });

      return { ...post, tags: postTags };
    } catch (error) {
      throw ApiError.badRequest('error', error);
    }
  };

  getAllPosts = async () => {
    const posts = await Post.findAll({
      raw: true,
      nest: true,
      include: [{ model: Tag, attributes: ['items'] }, { model: User }, { model: Comment }],
    });

    return this.convertePosts(posts);
  };

  getPostById = async (id) => {
    try {
      await Post.increment('viewsCount', { by: 1, where: { id } });
      const postData = await Post.findOne({
        where: { id },
        raw: true,
        nest: true,
        include: [{ model: Tag, attributes: ['items'] }, { model: User }, { model: Comment }],
      });

      const { items } = postData.tags;
      const user = new UserDto(postData.user);

      return { ...postData, tags: items, user };
    } catch (error) {
      throw ApiError.badRequest('Пост не найден', error);
    }
  };

  getPostByTag = async (tag) => {
    try {
      const posts = await Post.findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: Tag,
            attributes: ['items'],
            where: { items: { [Op.contains]: [tag] } },
          },
          { model: User },
          { model: Comment },
        ],
      });
      return this.convertePosts(posts);
    } catch (error) {
      throw ApiError.badRequest('Посты не найдены', error);
    }
  };
  updatePosts = async (title, text, id, filename, tags) => {
    const postData = await Post.update(
      { title, text, previewImage: filename },
      { where: { id }, returning: true },
    );
    await Tag.update({ items: tags }, { where: { postId: id } });

    return postData;
  };
}

export default new PostService();
