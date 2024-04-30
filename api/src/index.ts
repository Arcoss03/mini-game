import fastify from 'fastify';
import { AddressInfo } from 'net';
import dotenv from 'dotenv';
import postsRoutes from './routes/posts';
import usersRoutes from './routes/users';

const app = fastify({ logger: true });

dotenv.config();

app.get('/', async (request, reply) => {
    return { hello: 'world', process: process.env.DB_USER ?? 'unknown'};
});

postsRoutes(app);
usersRoutes(app);

const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log(`app listening on http://localhost:${(app.server.address() as AddressInfo).port} 🚀`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();

