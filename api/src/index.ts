import fastify from 'fastify';
import { AddressInfo } from 'net';

const app = fastify({ logger: true });

app.get('/', async (request, reply) => {
    return { hello: 'world', process: process.env.DB_USER ?? 'unknqsddown'};
});

const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log(`app listening on ${(app.server.address() as AddressInfo).port} 🚀`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();

