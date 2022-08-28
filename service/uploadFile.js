import cloudinary from '../core/cloudinary.js';
import { File } from '../models/models.js';

class UploadFile {
  upload = async (file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ use_filename: true, folder: 'Blog' }, (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            const uploadResult = {
              ...result,
              thumb: cloudinary.url(result.public_id, {
                width: 1000,
                quality: 'auto',
                fetch_format: 'auto',
                crop: 'scale',
              }),
            };
            const file = File.create({
              url: uploadResult.secure_url,
              thumb: uploadResult.thumb,
              public_id: uploadResult.public_id,
              format: uploadResult.format,
            });

            resolve(file);
          }
        })
        .end(file.data);
    });
  };
}

export default new UploadFile();
