import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { JwtPayload } from '../../interfaces/JwtPayload';


async function postGPRoutes(fastify: FastifyInstance) {
    fastify.addHook('preHandler', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.status(401).send({ error: 'Invalid token' });
        }
    });
    // Route to create GF
    fastify.post('/create', async (request: FastifyRequest, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
    
        try {
            const data = request.body as { name: string};
            const [result] : any = await fastify.db.query(
                'INSERT INTO room_GP (name,creation_date) VALUES (?,?)',
                [data.name ,new Date()]
            );
            await fastify.db.query(
                'INSERT INTO guess_prompt_participant (room_GP_id,user_id) VALUES (?, ?)',
                [result.insertId, payload.id]
            );
            const id=result.insertId+ 11111
            reply.send({message: "GP room created successfully",id:id });
            return;
            
            
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });


    // Route to join GF
    fastify.post('/join', async (request: FastifyRequest, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
    
        try {
            const data = request.body as { id: number };
            data.id -= 11111;
            
            const [existingParticipant]:any= await fastify.db.query(
                'SELECT * FROM guess_prompt_participant WHERE room_GP_id = ? AND user_id = ?',
                [data.id, payload.id]
            );
            if (existingParticipant.length > 0) {
                reply.status(400).send({ error: 'User already in the room' });
                return;
            }
            await fastify.db.query(
                'INSERT INTO guess_prompt_participant (room_GP_id, user_id) VALUES (?, ?)',
                [data.id, payload.id]
            );
            const id=data.id + 11111
            reply.send({ message: "Joined GP successfully", id: id});
            return;
        
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
        
    });
}
export default postGPRoutes;