import dotenv from "dotenv";
dotenv.config();
import promise from "bluebird";

const options = {
  promiseLib: promise,
  query: (e) => {},
};

import pgPromise from "pg-promise";
const pgp = pgPromise(options);
const types = pgp.pg.types;

types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

const databaseConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const db = pgp(databaseConfig);

export default db;
