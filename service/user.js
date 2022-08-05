import ApiError from '../error/index.js';
import { Post, User, Comment } from '../models/models.js';
import bcrypt from 'bcrypt';
import UserDto from '../dtos/userDto.js';
import TokenService from './token.js';
import { Op } from 'sequelize';

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
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw ApiError.notFound('Пользователь с таким email не найден');
    }

    const isEqualPassword = await bcrypt.compare(password, user.password);
    if (!isEqualPassword) {
      throw ApiError.badRequest('Не верный пароль');
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
      throw ApiError.unauthorized('Пользователь не авторизован1');
    }

    const tokenUserData = TokenService.validateRefreshToken(token);

    const tokenFromDB = await TokenService.findToken(token);
    if (!tokenUserData || !tokenFromDB) {
      throw ApiError.unauthorized('Пользователь не авторизован2');
    }

    const user = await User.findOne({ where: { id: tokenUserData.id } });
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
      { avatar, email, fullName, nickName, city },
      { where: { id: userId }, returning: true, plain: true },
    );
    return userData[1];
  };

  getCurrentUser = async (id) => {
    const userData = await User.findOne({
      where: { id },
      include: [
        {
          model: Comment,
          include: [{ model: Post }, { model: User }],
        },
        {
          model: Post,
        },
      ],
    });
    return userData;
  };
}

export default new UserService();
