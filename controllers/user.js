import user from '../service/user.js';
import { validationResult } from 'express-validator/src/validation-result.js';
import { createFileName } from '../utils/index.js';

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
      console.log(error);
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
      console.log(error);
      next(error);
    }
  };
  getUsers = async (req, res, next) => {
    try {
      const users = await user.getUsers();
      res.json(users);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  updateUserInfo = async (req, res, next) => {
    try {
      const { email, fullName, nickName, city } = req.body;
      const currentUser = req.user;
      const file = req.files;
      let fileName;
      if (file) {
        fileName = createFileName(file.img);
      }
      const userData = await user.updateUser({
        userId: currentUser.data.id,
        avatar: fileName,
        email,
        fullName,
        nickName,
        city,
      });
      res.json(userData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getCurrentUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userData = await user.getCurrentUser(id);
      res.json(userData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default UserController;
