import { Op } from 'sequelize';
import PostDto from '../dtos/postDto.js';
import UserDto from '../dtos/userDto.js';
import ApiError from '../error/index.js';
import { Comment, Post, Tag, User } from '../models/models.js';

class PostService {
  convertePosts = (posts) => {
    return posts.map((post) => {
      const postItem = new PostDto(post);
      const postUser = post.user ? new UserDto(post.user) : null;
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
      await User.increment('rating', { by: 1, where: { id: userId } });

      return { id: post.id };
    } catch (error) {
      throw ApiError.badRequest('error', error);
    }
  };

  getAllPosts = async (query) => {
    let whereOption = {};
    if (query) {
      whereOption = {
        title: {
          [Op.iLike]: `%${query}%`,
        },
      };
    }

    const posts = await Post.findAll({
      where: whereOption,
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
          { model: Comment, include: { model: User } },
        ],
        order: [[Comment, 'createdAt', 'DESC']],
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

  getUserPosts = async (id) => {
    const posts = await Post.findAll({
      nest: true,
      where: { userId: id },
      include: [
        {
          model: Tag,
          attributes: ['items'],
        },

        { model: Comment, include: { model: User } },
      ],
    });
    const parsedPosts = JSON.parse(JSON.stringify(posts));
    return this.convertePosts(parsedPosts);
  };

  updatePosts = async (title, text, id, filename, tags) => {
    const postData = await Post.update(
      { title, text, previewImage: filename },
      { where: { id }, returning: true },
    );
    await Tag.update({ items: tags }, { where: { postId: id } });

    return postData;
  };

  likePost = async (userId, id) => {
    const postData = await Post.findOne({ where: { id } });
    const postDataLikes = [];

    if (!postData.likes) {
      postDataLikes.push(userId);
      postData.likes = postDataLikes;
      return await postData.save().then((data) => data.likes);
    }
    if (postData.likes.includes(userId)) {
      const filteredData = postData.likes.filter((item) => item !== userId);
      postData.likes = filteredData;
      return await postData.save().then((data) => data.likes);
    } else {
      postDataLikes.push(userId);
      postData.likes = [...postData.likes, ...postDataLikes];
      return await postData.save().then((data) => data.likes);
    }

    // return postData;
  };
}

export default new PostService();
