import express, { json } from 'express';
import cors from 'cors';
import Routes from './Routes/index.js';
import dotenv from 'dotenv';
import ErrorHandling from './middleware/ErrorHandling.js';
import fileUpload from 'express-fileupload';
import path from 'path';
import pkg from 'pg';

import * as models from './models/models.js';
import cookieParser from 'cookie-parser';

const { Client } = pkg;
const __dirname = path.resolve(path.dirname(''));

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://192.168.0.30:3000'],
  }),
);
app.use(cookieParser());
app.use(fileUpload({}));
app.use('/api', Routes());

app.use(ErrorHandling);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const start = async () => {
  try {
    // await sequlize.authenticate();
    // await sequlize.sync();
    client.connect();

    client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        console.log(JSON.stringify(row));
      }
      client.end();
    });
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
