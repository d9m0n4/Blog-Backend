import { createFileName } from '../utils/index.js';
import commentService from '../service/comment.js';

class CommentsController {
  createComment = async (req, res, next) => {
    try {
      const { userId, postId, comment } = req.body;
      const { file } = req.files;
      const filesArray = [];
      file.length ? filesArray.push(...file) : filesArray.push(file);

      const fileName = filesArray.map((file) => createFileName(file));
      const commentData = await commentService.createComment(userId, postId, comment, fileName);
      res.json(commentData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default CommentsController;
