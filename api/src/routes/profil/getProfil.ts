import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';



async function getProfilRoutes(fastify: FastifyInstance) {
    
    // Route to get profil
    fastify.get<{ Params: { id: string } }>('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    
        
        try {
            const id = request.params.id 
            const [rows]: any = await fastify.db.query('SELECT id, pseudo, email, profil, creation_date, profil_picture, description FROM users WHERE id = ?', [id]);
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