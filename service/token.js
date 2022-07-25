import jwt from 'jsonwebtoken';
import ApiError from '../error/index.js';
import { Token } from '../models/models.js';
import dotenv from 'dotenv';
dotenv.config();

class TokenService {
  generateTokens = (payload) => {
    const accessToken = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 6, data: payload },
      process.env.ACCESSPRIVATKEY,
    );
    const refreshToken = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 60, data: payload },
      process.env.REFRESHPRIVATKEY,
    );
    console.log(jwt.decode(accessToken));
    return {
      accessToken,
      refreshToken,
    };
  };

  validateAccessToken = (token) => {
    try {
      const userData = jwt.verify(token, process.env.ACCESSPRIVATKEY);
      return userData;
    } catch (error) {
      return null;
    }
  };

  validateRefreshToken = (token) => {
    try {
      const userData = jwt.verify(token, process.env.REFRESHPRIVATKEY);
      return { ...userData, ...userData.data };
    } catch (error) {
      return null;
    }
  };

  saveToken = async (userId, refresh) => {
    try {
      const token = await Token.findOne({ where: { userId } });
      if (token) {
        token.refreshToken = refresh;
        return token.save();
      }
      const userToken = await Token.create({ userId, refreshToken: refresh });
      return userToken;
    } catch (error) {
      throw ApiError.badRequest('ошибка создания токена');
    }
  };

  removeToken = async (token) => {
    return await Token.destroy({ where: { refreshToken: token } });
  };

  findToken = async (token) => {
    const data = await Token.findOne({ where: { refreshToken: token } });
    return data;
  };
}

export default new TokenService();
