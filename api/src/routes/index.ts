import { FastifyInstance } from 'fastify';
import loginRoutes from './auth/login';
import registerRoutes from './auth/register';
import tokenRoutes from './auth/token';
import postRoutes from './tpf/postRoutes';
import getRoutes from './tpf/getRoutes';
import putRoutes from './tpf/putRoutes'
import getProfilRoutes from './profil/getProfil'
import putProfilRoutes from './profil/putProfil'

//used to register all routes
async function routes(fastify: FastifyInstance) {
    fastify.register(loginRoutes, { prefix: '/auth' });
    fastify.register(registerRoutes, { prefix: '/auth' });
    fastify.register(tokenRoutes, { prefix: '/auth' });
    fastify.register(postRoutes, { prefix: '/tpf' });
    fastify.register(putRoutes, { prefix: '/tpf' });
    fastify.register(getRoutes, { prefix: '/tpf' });
    fastify.register(getProfilRoutes, {prefix: '/profil' });
    fastify.register(getProfilRoutes, {prefix: '/profil' });
}

export default routes;
