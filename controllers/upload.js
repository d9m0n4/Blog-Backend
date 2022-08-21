import uploadFile from '../service/uploadFile.js';

class UploadController {
  uploadFiles = async (req, res, next) => {
    try {
      const file = req.files;
      const fileData = await uploadFile.upload(file.img);
      res.json({ url: fileData });
    } catch (error) {
      next(error);
    }
  };
}

export default UploadController;
