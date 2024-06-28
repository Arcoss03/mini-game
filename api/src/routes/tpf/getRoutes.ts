import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { RouteParams } from '../../interfaces/RouteParams';


async function getRoutes(fastify: FastifyInstance) {

    //get all tu_preferes
    fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const [rows] = await fastify.db.query('SELECT * FROM tu_preferes ORDER BY RAND() LIMIT 30;');
        reply.send(rows);
    });

    fastify.get<{ Params: RouteParams }>('/:id', async (request: FastifyRequest<{ Params: RouteParams }>, reply: FastifyReply) => {
        const userId = request.params.id // Extraire l'ID utilisateur du JWT
        try {
          // Requête SQL pour sélectionner les tu_preferes non votés par l'utilisateur
          const [rows] = await fastify.db.query(
            `SELECT tp.*
            FROM tu_preferes tp
            LEFT JOIN play_tpf pt ON tp.id = pt.tu_preferes_id AND pt.user_id = ?
            WHERE pt.tu_preferes_id IS NULL
            ORDER BY RAND()
            LIMIT 30;
            `,
            [userId]
          );
    
          reply.send(rows);
        } catch (error) {
          request.log.error(error);
          reply.status(500).send({ error: 'An error occurred while fetching the records' });
        }
      });

}

export default getRoutes;
