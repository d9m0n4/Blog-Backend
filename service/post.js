import { Op } from 'sequelize';
import PostDto from '../dtos/postDto.js';
import UserDto from '../dtos/userDto.js';
import ApiError from '../error/index.js';
import { Comment, Post, Tag, User } from '../models/models.js';

class PostService {
  create = async (title, text, tags, userId) => {
    try {
      const post = await Post.create({ title, text, userId });
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

    const postsData = posts.map((post) => {
      const postItem = new PostDto(post);
      const postUser = new UserDto(post.user);
      const { items } = post.tags;
      return { ...postItem, user: postUser, tags: [...items] };
    });
    return postsData;
  };

  getPostById = async (id) => {
    try {
      const postData = await Post.findByPk(id, {
        raw: true,
        nest: true,
        include: [{ model: Tag, attributes: ['items'] }, { model: User }, { model: Comment }],
      });

      const { items } = postData.tags;
      const user = new UserDto(postData.user);

      return { ...postData, user, tags: items };
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
        ],
      });
      return posts;
    } catch (error) {
      throw ApiError.badRequest('Посты не найдены', error);
    }
  };
}

export default new PostService();
