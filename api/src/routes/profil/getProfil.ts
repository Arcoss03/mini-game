import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { JwtPayload } from '../../interfaces/JwtPayload';

// Route to login a user with his token
async function getProfilRoutes(fastify: FastifyInstance) {
    fastify.get('/profil', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
            const payload = request.user as JwtPayload;
            if (!payload.id) {
                reply.status(401).send({ error: 'Invalid token' });
                return;
            }
            const [rows]: any = await fastify.db.query('SELECT id, pseudo, email, profil, creation_date FROM users WHERE id = ?', [payload.id]);
            if (rows.length === 0) {
                reply.status(404).send({ error: 'User not found' });
                return;
            }
            reply.send({ user: rows[0] });
        } catch (error) {
            reply.status(401).send({ error: 'Invalid token' });
        }
    });
}
export default getProfilRoutes;