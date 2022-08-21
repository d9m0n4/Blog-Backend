import multer, { memoryStorage } from 'multer';

const storage = memoryStorage();

const uploader = multer(storage);

export default uploader;
