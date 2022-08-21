import commentService from '../service/comment.js';
import uploadFile from '../service/uploadFile.js';

class CommentsController {
  createComment = async (req, res, next) => {
    try {
      const { userId, postId, comment } = req.body;
      const { files } = req;
      const fileNames = [];

      if (files) {
        const { file } = files;
        if (Array.isArray(file)) {
          for (const item of file) {
            const result = await uploadFile.upload(item);
            fileNames.push(result);
          }
        } else {
          const result = await uploadFile.upload(file);
          fileNames.push(result);
        }
      }

      const commentData = await commentService.createComment(userId, postId, comment, fileNames);
      res.json(commentData);
    } catch (error) {
      next(error);
    }
  };
  getUserComments = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userComments = await commentService.getUserComments(id);
      res.json(userComments);
    } catch (error) {
      next(error);
    }
  };
}

export default CommentsController;
