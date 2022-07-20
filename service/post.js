import { Op } from 'sequelize';
import PostDto from '../dtos/postDto.js';
import UserDto from '../dtos/userDto.js';
import ApiError from '../error/index.js';
import { Comment, Post, Tag, User } from '../models/models.js';

class PostService {
  convertePosts = (posts) => {
    return posts.map((post) => {
      console.log(post);
      const postItem = new PostDto(post);
      const postUser = new UserDto(post.user);
      const { items } = post.tags[0];
      const comments = post.comments.map((comment) => {
        return { ...comment, user: new UserDto(comment.user) };
      });
      return { ...postItem, user: postUser, tags: [...items], comments };
    });
  };

  create = async (title, text, tagsArr, userId, fileName) => {
    try {
      const post = await Post.create({ title, text, userId, previewImage: fileName });
      await Tag.create({ items: tagsArr, postId: post.id });

      return { id: post.id };
    } catch (error) {
      throw ApiError.badRequest('error', error);
    }
  };

  getAllPosts = async () => {
    const posts = await Post.findAll({
      nest: true,
      include: [
        { model: Tag, attributes: ['items'] },
        { model: User, nested: true },
        { model: Comment, include: { model: User } },
      ],
      order: [['createdAt', 'DESC']],
    });

    const parsedPosts = JSON.parse(JSON.stringify(posts));

    return this.convertePosts(parsedPosts);
  };

  getPostById = async (id) => {
    try {
      await Post.increment('viewsCount', { by: 1, where: { id } });
      const postData = await Post.findOne({
        where: { id },
        nest: true,
        include: [
          { model: Tag, attributes: ['items'] },
          { model: User },
          { model: Comment, include: { model: User }, order: [['createdAt', 'DESC']] },
        ],
      });

      const parsedPosts = JSON.parse(JSON.stringify(postData));
      const { items } = postData.tags[0];
      const user = new UserDto(parsedPosts.user);
      const comments = parsedPosts.comments.map((comment) => {
        return { ...comment, user: new UserDto(comment.user) };
      });
      return { ...parsedPosts, tags: items, user, comments };
    } catch (error) {
      throw ApiError.badRequest('Пост не найден', error);
    }
  };

  getPostByTag = async (tag) => {
    try {
      const posts = await Post.findAll({
        nest: true,
        include: [
          {
            model: Tag,
            attributes: ['items'],
            where: { items: { [Op.contains]: [tag] } },
          },
          { model: User },
          { model: Comment, include: { model: User } },
        ],
      });
      const parsedPosts = JSON.parse(JSON.stringify(posts));
      return this.convertePosts(parsedPosts);
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
