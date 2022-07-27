import { DataTypes, Sequelize } from 'sequelize';
import sequlize from '../core/db.js';

const User = sequlize.define('user', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fullName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  rating: { type: DataTypes.INTEGER, defaultValue: 1 },
  avatar: { type: DataTypes.STRING },
});

const Token = sequlize.define('token', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  refreshToken: { type: DataTypes.STRING(1000) },
});

const Post = sequlize.define('post', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },

  text: {
    type: DataTypes.STRING(5000),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  previewImage: { type: DataTypes.STRING, allowNull: false },
  viewsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  likes: { type: DataTypes.ARRAY(DataTypes.STRING(1000)), defaultValue: Sequelize.ARRAY },
});

const Comment = sequlize.define('comment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  text: { type: DataTypes.STRING },
  files: { type: DataTypes.ARRAY(DataTypes.STRING) },
});

const Tag = sequlize.define('tag', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  items: { type: DataTypes.ARRAY(DataTypes.STRING) },
});

Token.hasMany(User);
Token.belongsTo(User);

User.hasMany(Post, {
  allowNull: false,
  validate: {
    notEmpty: true,
  },
});
Post.belongsTo(User, {
  allowNull: false,
});

Post.hasMany(Tag, {
  allowNull: false,
});
Tag.belongsTo(Post);

Post.hasMany(Comment);
Comment.belongsTo(Post);

User.hasMany(Comment);
Comment.belongsTo(User);

export { User, Tag, Post, Comment, Token };
