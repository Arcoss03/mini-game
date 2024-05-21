import { RouteParams } from '../../interfaces/RouteParams';
import type { TuPreferes } from '../../interfaces/TuPreferes';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

async function putRoutes(fastify: FastifyInstance) {

    fastify.addHook('onRequest', async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      });
      
  fastify.put<{ Params: RouteParams }>("/vote/:id", async (request, reply) => {
    const [rows]: any = await fastify.db.query(
      "SELECT * FROM tu_preferes WHERE id = ?",
      [request.params.id]
    );
    if (rows.length === 0) {
      reply.status(404);
      return { error: "Post not found" };
    } else {
      const selectedClick = request.body as { selectedClick: number };
      if (selectedClick.selectedClick === 1) {
        await fastify.db.query(
          "UPDATE tu_preferes SET nb_clic1 = nb_clic1 + 1 WHERE id = ?",
          [request.params.id]
        );
      } else if (selectedClick.selectedClick === 2) {
        await fastify.db.query(
          "UPDATE tu_preferes SET nb_clic2 = nb_clic2 + 1 WHERE id = ?",
          [request.params.id]
        );
      } else {
        reply.status(400);
        return { error: "Invalid click" };
      }
      reply.send({ result: "success" });
    }
  });
}

export default putRoutes;
