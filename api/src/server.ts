import Fastify from 'fastify';
import authRoute from './routes/auth';
import tpfRoute from './routes/tuPreferes';
import jwt from '@fastify/jwt';
import db from './db';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
    logger: true
  });


fastify.register(jwt, {
    secret: process.env.JWT_SECRET as string || 'supersecret',
    sign: {
      expiresIn: '30d'  // 30 days validity
  }
});
fastify.register(authRoute, { prefix: '/auth' });
fastify.register(tpfRoute, { prefix: '/tpf' });
fastify.register(db);
fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
});
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  });

