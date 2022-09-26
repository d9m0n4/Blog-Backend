import ApiError from '../error/index.js';
import { Post, User, Comment, File } from '../models/models.js';
import bcrypt from 'bcrypt';
import UserDto from '../dtos/userDto.js';
import TokenService from './token.js';
import { Op } from 'sequelize';
import PostDto from '../dtos/postDto.js';

class UserService {
  registration = async (email, password, fullName) => {
    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      throw ApiError.badRequest('Пользователь с таким email уже существует');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: passwordHash,
    });

    const userData = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userData });
    await TokenService.saveToken(userData.id, tokens.refreshToken);

    return { userData, ...tokens };
  };

  login = async (email, password) => {
    const user = await User.findOne({
      where: { email },
      include: [{ model: File, nested: true }],
    });

    if (!user) {
      throw ApiError.notFound('Пользователь с таким email не найден');
    }

    const isEqualPassword = await bcrypt.compare(password, user.password);
    if (!isEqualPassword) {
      throw ApiError.badRequest('Не верный логин или пароль');
    }

    const userData = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userData });
    await TokenService.saveToken(userData.id, tokens.refreshToken);

    return { userData, ...tokens };
  };

  logout = async (token) => {
    return await TokenService.removeToken(token);
  };

  refreshToken = async (token) => {
    if (!token) {
      throw ApiError.unauthorized('Пользователь не авторизован');
    }

    const tokenUserData = TokenService.validateRefreshToken(token);

    const tokenFromDB = await TokenService.findToken(token);
    
    console.log('ut', tokenUserData)
    console.log('dbt', tokenFromDB)
    
    if (!tokenUserData || !tokenFromDB) {
      throw ApiError.unauthorized('Пользователь не авторизован');
    }

    const user = await User.findOne({
      where: { id: tokenUserData.id },
      include: [{ model: File, nested: true }],
    });
    const userData = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...tokenUserData });
    await TokenService.saveToken(tokenUserData.id, tokens.refreshToken);

    return { userData, ...tokens };
  };

  getUsers = async () => {
    const posts = await Post.findAll();
    const postsUsers = posts.map((post) => post.userId);
    const users = await User.findAll({
      where: {
        id: {
          [Op.or]: postsUsers,
        },
      },
      include: [{ model: File, nested: true }],
      order: [['rating', 'DESC']],
      limit: 5,
    });
    if (!users) {
      throw ApiError.badRequest('Авторы не найдены');
    }
    const usersData = users.map((user) => new UserDto(user));

    return usersData;
  };

  updateUser = async ({ userId, avatar, email, fullName, nickName, city }) => {
    const userData = await User.update(
      { email, fullName, nickName, city },
      {
        where: { id: userId },
        returning: true,
      },
    );

    const avatarFromDB = await File.findOne({ where: { userId } });

    if (avatarFromDB) {
      await File.update({ ...avatar }, { where: { userId } });
    } else {
      await File.create({ ...avatar, userId });
    }

    const plainedUserData = userData[1][0].get();
    const userAvatar = await File.findOne({ where: { userId } });
    const user = { ...plainedUserData, file: userAvatar };
    const data = new UserDto(user);
    return data;
  };

  getCurrentUser = async (id) => {
    const userData = await User.findOne({
      where: { id },
      nest: true,

      include: [
        {
          model: Comment,
          include: [
            { model: Post },
            { model: User, include: { model: File, attributes: ['url', 'thumb'] } },
          ],
        },
        {
          model: Post,
          include: [{ model: Comment }, { model: File }],
        },
        { model: File, nested: true, attributes: ['url', 'thumb'] },
      ],
    });

    const data = JSON.parse(JSON.stringify(userData));

    const userComments = data.comments.map((comment) => {
      const commentUser = new UserDto(comment.user);
      return { ...comment, user: commentUser };
    });

    const user = new UserDto(data);
    const userPosts = data.posts.map((postItem) => new PostDto(postItem));
    return { ...user, comments: userComments, posts: userPosts };
  };
}

export default new UserService();
