import { createFileName } from '../utils/index.js';
import commentService from '../service/comment.js';

class CommentsController {
  createComment = async (req, res, next) => {
    try {
      const { userId, postId, comment } = req.body;
      const files = req.files;
      const filesArray = [];
      if (files) {
        files.file.length ? filesArray.push(...files.file) : filesArray.push(files.file);
      }

      const fileName = filesArray ? filesArray.map((file) => createFileName(file)) : null;
      const commentData = await commentService.createComment(userId, postId, comment, fileName);
      res.json(commentData);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default CommentsController;
