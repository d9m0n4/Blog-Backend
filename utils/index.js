import path from 'path';
import * as uuid from 'uuid';

export const createFileName = (img) => {
  const filenameid = uuid.v4();
  const filename = filenameid + img.name;
  const __dirname = path.resolve(path.dirname(''));
  img.mv(path.resolve(__dirname, 'static', filename));
  return filename;
};
