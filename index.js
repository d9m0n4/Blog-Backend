import express, { json } from 'express';
import cors from 'cors';
import Routes from './Routes/index.js';
import sequlize from './core/db.js';
import dotenv from 'dotenv';
import ErrorHandling from './middleware/ErrorHandling.js';
import * as models from './models/models.js';

dotenv.config();

const app = express();

app.use(json());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  }),
);
app.use('/api', Routes);

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
  } catch (error) {}
};

start();
