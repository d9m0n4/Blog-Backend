import ApiError from '../error/index.js';
import TokenService from '../service/token.js';

export default function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    console.log('authHr', authorizationHeader)
    if (!authorizationHeader) {
      return next(ApiError.unauthorized('Пользователь не авторизован'));
    }
    const accessToken = authorizationHeader.split(' ')[1];
   console.log('access', accessToken)
    if (!accessToken) {
      return next(ApiError.unauthorized('Пользователь не авторизован'));
    }
    const userData = TokenService.validateAccessToken(accessToken);
console.log('ud', userData)
    if (!userData) {
      return next(ApiError.unauthorized('Пользователь не авторизован'));
    }
    req.user = userData;
    next();
  } catch (error) {
    return ApiError.unauthorized('Пользователь не авторизован');
  }
}
