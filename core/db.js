import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequlize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  dialect: 'postgres',
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  use_env_variable: 'DATABASE_URL',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequlize;
