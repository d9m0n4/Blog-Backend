import user from '../service/user.js';
import { validationResult } from 'express-validator/src/validation-result.js';
import UserDto from '../dtos/userDto.js';

class UserController {
  registration = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const { email, password, fullName } = req.body;

      const userData = await user.registration(email, password, fullName);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  };
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userData = await user.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  };
  logout = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      await user.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.status(200);
    } catch (error) {
      next(error);
    }
  };
  refresh = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const userData = await user.refreshToken(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
