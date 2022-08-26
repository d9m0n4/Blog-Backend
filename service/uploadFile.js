import cloudinary from '../core/cloudinary.js';

class UploadFile {
  upload = async (file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ use_filename: true, folder: 'Blog' }, (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve({
              ...result,
              thumb: cloudinary.url(result.public_id, {
                width: 300,
                quality: 'auto',
                fetch_format: 'auto',
                crop: 'scale',
              }),
            });
          }
        })
        .end(file.data);
    });
  };
}

export default new UploadFile();
