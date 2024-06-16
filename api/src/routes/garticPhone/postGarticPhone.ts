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
            const [newChat]:any=await fastify.db.query(
                'INSERT INTO chat_room (creation_date) VALUES (?)',[new Date()]
            )
            const [result] : any = await fastify.db.query(
                'INSERT INTO room_GP (name,creation_date,type,creator_id,chat_room_id) VALUES (?,?,?,?,?)',
                [data.name ,new Date(),"lobby",payload.id,newChat.insertId]
            );
            await fastify.db.query(
                'INSERT INTO chat_participant (chat_room_id,user_id) VALUES (?,?)',
                [newChat.insertId,payload.id]
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
            const[room_play]:any= await fastify.db.query(
                'SELECT * FROM room_GP WHERE id = ?',
                [data.id]
            )
            await fastify.db.query(
                'INSERT INTO chat_participant (chat_room_id,user_id) VALUES (?,?)',
                [room_play[0].chat_room_id,payload.id]
            );
            if(room_play[0].type!=="lobby"){
                reply.status(400).send({ error: 'Room is playing' });
                return;
            }
            

            
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

    fastify.post('/play', async (request: FastifyRequest, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
    
        try {
            const data = request.body as { id: number };
            data.id -= 11111;
            const[room_play]:any= await fastify.db.query(
                'SELECT * FROM room_GP WHERE id = ?',
                [data.id]
            )
            if(room_play[0].creator_id!==payload.id){
                reply.status(400).send({ error: 'Ne peux pas demarrer la partie' });
                return;
            }
            
            await fastify.db.query(
                'UPDATE room_GP set type=? where id=?',
                ["Play",data.id]
            );
            reply.send({ message: "Edit GP successfully"});
            return;
        
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
        
    });
}
export default postGPRoutes;