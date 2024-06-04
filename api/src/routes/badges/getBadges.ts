import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

async function getBadgesRoutes(fastify: FastifyInstance) {
    
    // Route to get badges
    fastify.get<{ Params: { id: string } }>('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    
        
        try {
            const id = request.params.id 
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

    // Routes to get all badges types
    fastify.get('/types', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const [rows]: any = await fastify.db.query('SELECT id, name FROM badge_type');
            reply.send({ badges: rows });
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });

    //get user stats for a badge id:
    fastify.get<{ Params: { type_badge_id: string; user_id: string } }>('/stats/:type_badge_id/:user_id', async (request: FastifyRequest<{ Params: { type_badge_id: string; user_id: string } }>, reply: FastifyReply) => {
        try {
            const { type_badge_id, user_id } = request.params;
            let query:string = '';
            if(type_badge_id === '3'){
                console.log('type_badge_id', type_badge_id);
                query = `
                WITH level_calc AS (
                    SELECT 
                        COUNT(*) AS post_count,
                        CASE
                            WHEN COUNT(*) = 0 THEN 0
                            WHEN COUNT(*) BETWEEN 1 AND 5 THEN 1
                            WHEN COUNT(*) BETWEEN 6 AND 25 THEN 2
                            ELSE 3
                        END AS level
                    FROM tu_preferes
                    WHERE author_id = ?
                    GROUP BY author_id
                )
                
                SELECT 
                    b.img_url,
                    b.title,
                    b.stat_description,
                    lc.post_count AS statistic
                FROM badge b
                JOIN level_calc lc ON b.level = lc.level
                WHERE b.type_badge_id = ?;
                `;
            } else {
                // cas d'erreur
                reply.status(404).send({ error: 'Badge not found' });
            }


            const [rows]: any = await fastify.db.query(query, [user_id,type_badge_id]);
            if (rows.length === 0) {
                reply.status(404).send({ error: 'Badge not found' });
                return;
            }
            reply.send(rows[0] );
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });
}

export default getBadgesRoutes;