import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { JwtPayload } from '../../interfaces/JwtPayload';

// Route to login a user with his token
async function getProfilRoutes(fastify: FastifyInstance) {
    fastify.addHook('preHandler', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.status(401).send({ error: 'Invalid token' });
        }
    });
    
    fastify.get('/profil', async (request: FastifyRequest, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
    
        try {
            const [rows]: any = await fastify.db.query('SELECT id, pseudo, email, profil, creation_date FROM users WHERE id = ?', [payload.id]);
            if (rows.length === 0) {
                reply.status(404).send({ error: 'User not found' });
                return;
            }
            reply.send({ user: rows[0] });
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });
}
export default getProfilRoutes;