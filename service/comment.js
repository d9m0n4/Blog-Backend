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
    const user = await User.findOne({ where: { id: userId } });
    const parsedComment = JSON.parse(JSON.stringify(commentData));
    return { ...parsedComment, user, assets: commentFiles };
  };
  getUserComments = async (userId) => {
    const comments = await Comment.findAll({
      where: { userId },
      nest: true,
      include: [
        { model: Post },
        { model: User, include: { model: File, as: 'avatar', nested: true } },
      ],
      order: [['createdAt', 'DESC']],
    });
    const parsedData = JSON.parse(JSON.stringify(comments));

    const readyComments = parsedData.map((comment) => {
      const commentPost = new PostDto(comment.post);
      const commentUser = new UserDto(comment.user);

      return { ...comment, post: commentPost, user: commentUser };
    });
    console.log(comments);
    return readyComments;
  };
}

export default new CommentService();
