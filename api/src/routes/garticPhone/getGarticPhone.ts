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
    fastify.get('/room/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
        try {
            const roomId = parseInt(request.params.id, 10);
            const adjustedId = roomId - 11111;
            const [roomChat]: any = await fastify.db.query(
                'SELECT chat_room_id FROM room_GP WHERE id = (?)',
                [adjustedId]
            );
            if (roomChat.length === 0) {
                reply.status(400).send({ error: 'Room not exist' });
                return;
            }
            reply.send({ roomChat:roomChat[0].chat_room_id});
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });
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


    fastify.get('/resume/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
        try {
            const roomId = parseInt(request.params.id, 10);
            const adjustedId = roomId - 11111; // The room that the user sees = Id room + 11111 to never have a room with only 1 number is used to find the real id of the room.
            const [nbPlayer]: any = await fastify.db.query(
                'SELECT COUNT(*) FROM guess_prompt_participant WHERE room_GP_id = (?)',
                [adjustedId]
            );
            if (nbPlayer.length === 0) {
                reply.status(400).send({ error: 'Room not exist' });
                return;
            }

            const [lastPrompt]: any = await fastify.db.query(
                'SELECT * FROM guess_prompt WHERE game_GP_id = (?) ORDER BY id DESC LIMIT ? ',
                [adjustedId,nbPlayer[0]['COUNT(*)']]
            );
            
            let data:any=[];
            let i=0;
            while(i<nbPlayer[0]['COUNT(*)']){
                
                const [firstPrompt]: any=await fastify.db.query(`
                    WITH RECURSIVE chain AS (
                        SELECT * 
                        FROM guess_prompt
                        WHERE id = ?
                        UNION ALL
                        SELECT t.*
                        FROM guess_prompt t
                        INNER JOIN chain c ON t.id = c.id_GP_before
                    )
                    SELECT  turn,prompt,img_url,users.pseudo 
                    FROM chain JOIN users ON chain.user_id = users.id`,[lastPrompt[i].id])
                    data.push(firstPrompt);
                    i++;
            }
            reply.send({ data:data});
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });



    fastify.get('/yourPlayerResume', async (request: FastifyRequest, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
        try {
            
            const [room]: any = await fastify.db.query(
                'SELECT room_GP.name,room_GP.id+11111 as id,room_GP.creation_date FROM guess_prompt_participant JOIN room_GP ON room_GP.id=guess_prompt_participant.room_GP_id WHERE guess_prompt_participant.user_id = (?)',
                [payload.id]
            );
            
            reply.send(room);
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });

    fastify.get<{ Params: { id: string } }>('/playerResume/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            
            const id = request.params.id 
            const [room]: any = await fastify.db.query(
                'SELECT room_GP.name,room_GP.id+11111 as id,room_GP.creation_date FROM guess_prompt_participant JOIN room_GP ON room_GP.id=guess_prompt_participant.room_GP_id WHERE guess_prompt_participant.user_id = (?)',
                [id]
            );
            
            reply.send(room);
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });
}
export default getGPRoutes;