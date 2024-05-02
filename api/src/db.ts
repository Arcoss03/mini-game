// dbConnector.ts

import fp from 'fastify-plugin';
import mysql from 'mysql2/promise';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

declare module 'fastify' {
  export interface FastifyInstance {
    db: mysql.Pool;
  }
}

const dbConnector: FastifyPluginAsync<any> = async (
  fastify: FastifyInstance,
) => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME
  });

  fastify.decorate('db', pool);

  fastify.addHook('onClose', async (instance) => {
    await pool.end();
  });
};

export default fp(dbConnector, {
  name: 'mysql-db-connector'
});
