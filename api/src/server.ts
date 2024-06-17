import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import routes from './routes';
import jwt, { FastifyJWT } from '@fastify/jwt';
import db from './db';
import dotenv from 'dotenv';
import cors from '@fastify/cors'
import setupSocket from './chat';
import setupSocketGF from './lobbyGP';


dotenv.config(); // Load environment variables

// create fastify instance
const fastify = Fastify({
    logger: true
  });

  

  // allow cors errors
  fastify.register(cors, {
    origin: "*", // Allow all origins
    methods: ["GET","POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
    credentials: true,
  });

  // Add hook to verify api key for all requests
fastify.addHook('onRequest', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    reply.code(401).send({ error: 'Unauthorized api Key' });
  }
});

// Register jwt plugin
fastify.register(jwt, {
    secret: process.env.JWT_SECRET as string || 'supersecret',
    sign: {
      expiresIn: '30d'  // 30 days validity
  }
});



setupSocket(fastify);
setupSocketGF(fastify);

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

