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
}

export default getBadgesRoutes;