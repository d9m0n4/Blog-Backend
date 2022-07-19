import { Comment } from '../models/models.js';

class CommentService {
  createComment = async (userId, postId, comment, file) => {
    const commentData = await Comment.create({ text: comment, files: file, userId, postId });
    return commentData;
  };
}

export default new CommentService();
