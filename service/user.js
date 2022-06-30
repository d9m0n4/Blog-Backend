import ApiError from '../error/index.js';
import { User } from '../models/models.js';
import bcrypt from 'bcrypt';
import UserDto from '../dtos/userDto.js';

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
    return userData;
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
    return userData;
  };
}

export default new UserService();
