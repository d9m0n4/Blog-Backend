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

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  };
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userData = await user.login(email, password);

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
