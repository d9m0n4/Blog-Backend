import PostDto from '../dtos/postDto.js';
import UserDto from '../dtos/userDto.js';
import { Comment, Post, User } from '../models/models.js';

class CommentService {
  createComment = async (userId, postId, comment, file) => {
    const commentData = await Comment.create({ text: comment, files: file, userId, postId });
    const user = await User.findOne({ where: { id: userId } });
    const f = JSON.parse(JSON.stringify(commentData));
    return { ...f, user };
  };
  getUserComments = async (userId) => {
    const comments = await Comment.findAll({
      where: { userId },
      nest: true,
      include: [{ model: Post }, { model: User }],
      order: [['createdAt', 'DESC']],
    });
    const parsedData = JSON.parse(JSON.stringify(comments));

    const readyComments = parsedData.map((comment) => {
      const commentPost = new PostDto(comment.post);
      const commentUser = new UserDto(comment.user);

      return { ...comment, post: commentPost, user: commentUser };
    });
    return readyComments;
  };
}

export default new CommentService();
