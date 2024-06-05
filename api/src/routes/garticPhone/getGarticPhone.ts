import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { JwtPayload } from '../../interfaces/JwtPayload';


async function getGPRoutes(fastify: FastifyInstance) {
    fastify.addHook('preHandler', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.status(401).send({ error: 'Invalid token' });
        }
    });
    // Route to get name/creation_date GF
    fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
        try {
            const roomId = parseInt(request.params.id, 10);
            const adjustedId = roomId - 11111;
            const [existingParticipant]: any = await fastify.db.query(
                'SELECT * FROM guess_prompt_participant WHERE room_GP_id = ? AND user_id = ?',
                [adjustedId, payload.id]
            );
            if (existingParticipant.length === 0) {
                reply.status(400).send({ error: 'User not exist in the room' });
                return;
            }
            const [roomInfo]: any = await fastify.db.query(
                'SELECT name,creation_date FROM room_GP WHERE id=?',
                [adjustedId]
            );
            reply.send({ room:{name:roomInfo[0].name,creation_date:roomInfo[0].creation_date}});
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });
}
export default getGPRoutes;