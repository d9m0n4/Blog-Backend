import PostDto from '../dtos/postDto.js';
import UserDto from '../dtos/userDto.js';
import { Comment, File, Post, User } from '../models/models.js';

class CommentService {
  createComment = async (userId, postId, comment, uploadedFiles) => {
    const commentData = await Comment.create({
      text: comment,
      userId,
      postId,
    });

    if (uploadedFiles.length > 0) {
      for (let file of uploadedFiles) {
        await File.create({ ...file, commentId: commentData.id });
      }
    }
    const commentFiles = await File.findAll({
      where: { commentId: commentData.id },
    });
    const user = await User.findOne({
      where: { id: userId },
      include: { model: File, attributes: ['url', 'thumb'] },
    });
    const userData = new UserDto(user);
    const parsedComment = JSON.parse(JSON.stringify(commentData));
    return { ...parsedComment, user: userData, assets: commentFiles };
  };
  getUserComments = async (userId) => {
    const comments = await Comment.findAll({
      where: { userId },
      nest: true,
      include: [
        { model: Post },
        { model: User, include: { model: File, nested: true, attributes: ['thumb', 'url'] } },
      ],
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
