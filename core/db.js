// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// dotenv.config();

// const sequlize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   dialect: 'postgres',
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
// });

import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

export default sequlize;
