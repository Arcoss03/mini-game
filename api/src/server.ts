import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import routes from './routes';
import jwt, { FastifyJWT } from '@fastify/jwt';
import db from './db';
import dotenv from 'dotenv';
import cors from '@fastify/cors'

dotenv.config();

const fastify = Fastify({
    logger: true
  });

fastify.addHook('onRequest', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    reply.code(401).send({ error: 'Unauthorized api Key' });
  }
});

fastify.register(cors, {
  // put your options here
  origin: "*", // Allow all origins
  methods: ["GET","POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  credentials: true,
});

fastify.register(jwt, {
    secret: process.env.JWT_SECRET as string || 'supersecret',
    sign: {
      expiresIn: '30d'  // 30 days validity
  }
});

fastify.decorate("authenticate", async function(request: { jwtVerify: () => any; }, reply: { send: (arg0: unknown) => void; }) {
  try {
      await request.jwtVerify();
  } catch (err) {
      reply.send(err);
  }
});
  
fastify.register(routes, { prefix: '/' });
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

