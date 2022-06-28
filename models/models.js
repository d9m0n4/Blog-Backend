import { DataTypes } from 'sequelize';
import sequlize from '../core/db.js';

const User = sequlize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  rating: { type: DataTypes.INTEGER, defaultValue: 1 },
});

const Post = sequlize.define('post', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  text: { type: DataTypes.STRING },
});

const Tag = sequlize.define('tag', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});

User.hasMany(Post);
Post.belongsTo(User);

Post.hasMany(Tag);
Tag.belongsTo(Post);

export { User, Post, Tag };
