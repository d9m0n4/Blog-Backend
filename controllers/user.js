import user from '../service/user.js';
import { validationResult } from 'express-validator/src/validation-result.js';
import { createFileName } from '../utils/index.js';
import uploadFile from '../service/uploadFile.js';

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
      const data = await user.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.status(200).json(data);
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
  getUsers = async (req, res, next) => {
    try {
      const users = await user.getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };
  updateUserInfo = async (req, res, next) => {
    try {
      const { email, fullName, nickName, city, avatar } = req.body;
      const { id } = req.user;
      const file = req.files;

      const uploadedFile = file ? await uploadFile.upload(file.img) : avatar;

      const userData = await user.updateUser({
        userId: id,
        avatar: uploadedFile,
        email,
        fullName,
        nickName,
        city,
      });
      res.json(userData);
    } catch (error) {
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
