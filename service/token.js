import jwt from 'jsonwebtoken';
import ApiError from '../error/index.js';
import { Token } from '../models/models.js';

class TokenService {
  generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, 'json_token', { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, 'jwt_refresh', { expiresIn: '1d' });
    return {
      accessToken,
      refreshToken,
    };
  };

  validateAccessToken = (token) => {
    try {
      const userData = jwt.verify(token, 'json_token');
      return userData;
    } catch (error) {
      return null;
    }
  };

  validateRefreshToken = (token) => {
    try {
      const userData = jwt.verify(token, 'jwt_refresh');
      return userData;
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
