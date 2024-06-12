import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getBadgeById, getBadgesListId, getLevel } from '../../utils/badges.utils';
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
                case '2': // Conformity badge
                    const [rows1]: any = await fastify.db.query(`
                        SELECT ROUND((SUM(vote_majority = 1) / COUNT(*)) * 100) AS percentage
                        FROM play_tpf
                        WHERE user_id = ?;
                        `, [user_id]);
                    let percentage = rows1[0].percentage;
                    if (percentage === null) {
                        percentage = 0;
                    }
                    const level2 = getLevel(percentage, [25, 50, 75]);
                    reply.send(getBadgeById(2, level2, percentage+'%'));
                    break;

                case '3': // Number of posts badge
                    query = `
                        SELECT COUNT(*) AS count
                        FROM tu_preferes
                        WHERE author_id = ?
                    `;
                    const [rows3]: any = await fastify.db.query(query, [user_id]);
                    const count3 = rows3[0].count;

                    let level = getLevel(count3, [5, 15, 30]);
                    reply.send(getBadgeById(3, level, count3));
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
