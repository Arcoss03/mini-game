import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { RouteParams } from '../../interfaces/RouteParams';

async function getRoutes(fastify: FastifyInstance) {
    fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const [rows] = await fastify.db.query('SELECT * FROM tu_preferes');
        reply.send(rows);
    });

    fastify.get<{ Params: RouteParams }>('/:id', async (request: FastifyRequest<{ Params: RouteParams }>, reply: FastifyReply) => {
        const [rows]: any = await fastify.db.query('SELECT * FROM tu_preferes WHERE id = ?', [request.params.id]);
        if (rows.length === 0) {
            reply.status(404).send({ error: 'Post not found' });
        } else {
            reply.send(rows[0]);
        }
    });
}

export default getRoutes;
