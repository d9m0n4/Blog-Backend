import cloudinary from '../core/cloudinary.js';
import ApiError from '../error/index.js';
import fs from 'fs';

class UploadFile {
  upload = async (file) => {
    let resultData;
    await cloudinary.uploader
      .upload_stream({ use_filename: true }, (error, result) => {
        if (error || !result) {
          throw ApiError.badRequest('Не удалось загрузить файл', error);
        }
        const fileData = {
          url: result.url,
        };
        resultData = fileData;
      })
      .end(file.data);
    return resultData;
  };
}

export default new UploadFile();
