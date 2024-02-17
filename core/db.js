import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequlize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
  dialect: 'postgres',
  host: process.env.DBHOST,
  // port: process.env.PGPORT,
  use_env_variable: 'DATABASE_URL',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequlize;
