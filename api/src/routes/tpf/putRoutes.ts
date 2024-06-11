import { RouteParams } from '../../interfaces/RouteParams';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { VoteTpf } from '../../interfaces/VoteTpf';

async function putRoutes(fastify: FastifyInstance) {

  // Update a tu_preferes by id and create a play_tpf entry if user_id is present
  fastify.put<{ Params: RouteParams }>("/vote/:id", async (request, reply) => {
    const [rows]: any = await fastify.db.query(
      "SELECT * FROM tu_preferes WHERE id = ?",
      [request.params.id]
    );

    if (rows.length === 0) {
      reply.status(404);
      return { error: "Post not found" };
    } else {
      const data = request.body as VoteTpf;

      if (data.selectedClick === 1) {
        await fastify.db.query(
          "UPDATE tu_preferes SET nb_clic1 = nb_clic1 + 1 WHERE id = ?",
          [request.params.id]
        );
      } else if (data.selectedClick === 2) {
        await fastify.db.query(
          "UPDATE tu_preferes SET nb_clic2 = nb_clic2 + 1 WHERE id = ?",
          [request.params.id]
        );
      } else {
        reply.status(400);
        return { error: "Invalid click" };
      }

      // Vérifiez si userId est présent
      if (data.userId) {
        // Insérer une nouvelle entrée dans play_tpf
        await fastify.db.query(
          "INSERT INTO play_tpf (user_id, tu_preferes_id, tpf_choice, vote_majority, date_view) VALUES (?, ?, ?, ?, NOW())",
          [data.userId, request.params.id, data.selectedClick, data.voteMajority]
        );
      }

      reply.send({ result: "success" });
    }
  });
}

export default putRoutes;
