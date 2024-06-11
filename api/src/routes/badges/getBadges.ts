import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getBadgeById, getBadgesListId } from '../../utils/badges.utils';
import { stat } from 'fs';

async function getBadgesRoutes(fastify: FastifyInstance) {
    
    // Route to get a badge by ID
    fastify.get<{ Params: { id: string } }>('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const id = request.params.id;
            const [rows]: any = await fastify.db.query('SELECT id, badge_name, badge_picture FROM badges WHERE id = ?', [id]);
            if (rows.length === 0) {
                reply.status(404).send({ error: 'Badge not found' });
                return;
            }
            reply.send({ badge: rows[0] });
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });

    // Route to get all badge types
    fastify.get('/types', async (request: FastifyRequest, reply: FastifyReply) => {
        reply.send(getBadgesListId());
    });

    // Route to get user stats for a badge type and user ID
    fastify.get<{ Params: { type_badge_id: string; user_id: string } }>('/stats/:type_badge_id/:user_id', async (request: FastifyRequest<{ Params: { type_badge_id: string; user_id: string } }>, reply: FastifyReply) => {
        try {
            const { type_badge_id, user_id } = request.params;
            let query: string = '';

            switch (type_badge_id) {
                case '3':
                    query = `
                        SELECT COUNT(*) AS count
                        FROM tu_preferes
                        WHERE author_id = ?
                    `;
                    const [rows]: any = await fastify.db.query(query, [user_id]);
                    const count = rows[0].count;
                    let level;
                    //si count est entre 0 et 10
                    if (count >= 0 && count <= 5) {
                        level = 0;
                    } else if (count > 5 && count <= 15) {
                        level = 1;
                    } else if (count > 20 && count <= 30) {
                        level = 2;
                    } else {
                        level = 3;
                    }
                    reply.send(getBadgeById(3, level, count));
                    break;

                default:
                    // Handle unknown badge types
                    reply.status(404).send({ error: 'Badge not found' });
                    return;
            }
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });
}

export default getBadgesRoutes;
