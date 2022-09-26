import express, { json } from 'express';
import cors from 'cors';
import Routes from './Routes/index.js';
import sequlize from './core/db.js';
import dotenv from 'dotenv';
import ErrorHandling from './middleware/ErrorHandling.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import * as models from './models/models.js';
import cookieParser from 'cookie-parser';

const __dirname = path.resolve(path.dirname(''));

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(
  cors({
    credentials: true,
    origin: 'https://cheblog.vercel.app/',
  }),
);
app.use(cookieParser());
app.use(fileUpload({}));
app.use('/api', Routes());

app.use(ErrorHandling);

const start = async () => {
  try {
    await sequlize.authenticate();
    await sequlize.sync();
    app.listen(process.env.PORT, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log(`server started on ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
