import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USERNAME } = process.env;

const pool = new Pool({
  user: PG_USERNAME,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: Number(PG_PORT),
});

pool.on('connect', () => {
  console.log('Database connection established.');
});

export default pool;
