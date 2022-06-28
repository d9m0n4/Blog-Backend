import ApiError from '../error/index.js';
import { User } from '../models/models.js';
import bcrypt from 'bcrypt';

class UserController {
  registration = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const candidate = User.findOne({ where: { email: req.body.email } });

    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'));
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: passwordHash,
    });
    res.json(user);
  };
}

export default UserController;
