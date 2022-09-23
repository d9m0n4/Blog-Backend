import { Op, Sequelize } from 'sequelize';
import PostDto from '../dtos/postDto.js';
import UserDto from '../dtos/userDto.js';
import ApiError from '../error/index.js';
import { Comment, File, Post, Tag, User } from '../models/models.js';

class PostService {
  convertePosts = (posts) => {
    return posts.map((post) => {
      const postItem = new PostDto(post);
      const postUser = post.user ? new UserDto(post.user) : null;

      const { items } = post.tags[0];

      const comments = post.comments.map((comment) => {
        const commentsUser = new UserDto(comment.user);

        return { ...comment, user: commentsUser };
      });
      return { ...postItem, user: postUser, tags: [...items], comments };
    });
  };

  create = async ({ title, text, utags, userId, file }) => {
    try {
      const post = await Post.create({
        title,
        text,
        userId,
      });

      await Tag.create({ items: [...utags], postId: post.id });

      if (file) {
        await File.create({
          ...file,
          postId: post.id,
        });
      }

      await User.increment('rating', { by: 1, where: { id: userId } });

      return { id: post.id };
    } catch (error) {
      throw ApiError.badRequest('error', error);
    }
  };

  getAllPosts = async (query) => {
    let whereOption = {};
    if (query.search) {
      whereOption = {
        title: {
          [Op.iLike]: `%${query.search}%`,
        },
      };
    }

    let page = query.page ? query.page - 1 : 0;
    page = page < 0 ? 0 : page;
    let limit = parseInt(query.limit || 10);
    limit = limit < 0 ? 10 : limit;
    const offset = page * limit;

    const posts = await Post.findAll({
      where: whereOption,
      nest: true,
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
      include: [
        { model: Tag, attributes: ['items'] },
        {
          model: User,
          nested: true,
          include: { model: File, attributes: ['thumb', 'url', 'id', 'public_id'] },
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              include: { model: File, attributes: ['thumb', 'url', 'id', 'public_id'] },
            },
            { model: File, attributes: ['thumb', 'url', 'id', 'public_id'] },
          ],
        },
        { model: File, attributes: ['thumb', 'url', 'id', 'public_id'], nested: true },
      ],
    });

    const postsCount = await Post.count();

    const parsedPosts = JSON.parse(JSON.stringify(posts));
    const convertedPosts = this.convertePosts([...parsedPosts]);
    return { posts: convertedPosts, count: postsCount };
  };

  getPopularPosts = async () => {
    const posts = await Post.findAll({
      attributes: {
        include: [[Sequelize.fn('COUNT', Sequelize.col('comments.id')), 'commentsCount']],
      },
      include: [
        {
          attributes: [],
          model: Comment,
        },
      ],
      group: ['post.id'],
      order: [[Sequelize.col('commentsCount'), 'DESC']],
    });

    const parsedPosts = JSON.parse(JSON.stringify(posts));
    const limitedPosts = parsedPosts.slice(0, 5);

    return limitedPosts;
  };

  getPostById = async (id) => {
    try {
      await Post.increment('viewsCount', { by: 1, where: { id } });
      const postData = await Post.findOne({
        where: { id },
        nest: true,
        include: [
          { model: Tag, attributes: ['items'] },
          { model: User, include: { model: File } },
          {
            model: Comment,
            include: [
              {
                model: User,
                include: { model: File, attributes: ['thumb', 'url', 'id', 'public_id'] },
              },
              { model: File, attributes: ['thumb', 'url', 'id', 'public_id'] },
            ],
          },
          { model: File, nested: true, attributes: ['url', 'thumb'] },
        ],
        order: [[Comment, 'createdAt', 'DESC']],
      });

      const parsedPost = JSON.parse(JSON.stringify(postData));
      const post = new PostDto(parsedPost);
      const { items } = postData.tags[0];
      const user = new UserDto(parsedPost.user);
      const comments = parsedPost.comments.map((comment) => {
        return { ...comment, user: new UserDto(comment.user) };
      });

      return { ...post, tags: items, user, comments };
    } catch (error) {
      console.log(error);
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
          { model: User, include: { model: File, nested: true } },
          { model: Comment, include: { model: User } },
          { model: File, nested: true, attributes: ['url', 'thumb'] },
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
        { model: File, nested: true },
      ],
    });
    const parsedPosts = JSON.parse(JSON.stringify(posts));
    return this.convertePosts(parsedPosts);
  };

  updatePosts = async ({ title, text, id, uploadedFile, utags }) => {
    const postData = await Post.update({ title, text }, { where: { id }, returning: true });
    await Tag.update({ items: [...utags] }, { where: { postId: id } });

    const file = await File.findOne({ where: { postId: id } });

    if (file) {
      await File.update({ ...uploadedFile }, { where: { postId: id } });
    } else {
      await File.create({
        ...uploadedFile,
        postId: id,
      });
    }

    const parsedData = JSON.parse(JSON.stringify(...postData[1]));

    return parsedData;
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
  };

  deletePost = async (id) => {
    const tags = await Tag.destroy({ where: { postId: id } });
    const comments = await Comment.destroy({ where: { postId: id } });
    const post = await Post.destroy({ where: { id } });

    console.log(post, tags, comments);

    if (post && tags) {
      return { post, tags, comments };
    }
    throw ApiError.badRequest('Не удалось удалить пост');
  };
}

export default new PostService();
