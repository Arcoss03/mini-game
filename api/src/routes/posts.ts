import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import db from '../db';

interface RouteParams {
    id: string;
  }

interface Post {
  id?: number;
  prompt1: string;
  img_url1: string;
  nb_clic1: number;
  prompt2: string;
  img_url2: string;
  nb_clic2: number;
  author_id: number;
  creation_date?: Date;
}



async function routes(fastify: FastifyInstance) {
    fastify.get('/posts', async (request, reply) => {
      const [rows] = await db.query('SELECT * FROM posts');
      return rows;
    });

    fastify.get<{ Params: RouteParams }>('/posts/:id', async (request, reply) => {
        const [rows]:any = await db.query('SELECT * FROM posts WHERE id = ?', [request.params.id]);
        if (rows.length === 0) {
          reply.status(404);
          return { error: 'Post not found' };
        } else {
        return rows[0];
        }
      });

      fastify.post('/posts', async (request, reply) => {
        try {
          const newPost:Post = request.body as Post;
          const result = await db.query(
            'INSERT INTO posts (prompt1, img_url1, nb_clic1, prompt2, img_url2, nb_clic2, author_id, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [newPost.prompt1, newPost.img_url1, newPost.nb_clic1, newPost.prompt2, newPost.img_url2, newPost.nb_clic2, newPost.author_id, new Date()]
          );
          reply.send({ result: "success" });
        } catch (error) {
          request.log.error(error);
          reply.status(500).send({ error: "An error occurred while creating the post" });
        }
      });

      //route tu update the number of clics
      fastify.put<{ Params: RouteParams }>('/posts/vote/:id', async (request, reply) => {
        const [rows]:any = await db.query('SELECT * FROM posts WHERE id = ?', [request.params.id]);
        if (rows.length === 0) {
          reply.status(404);
          return { error: 'Post not found' };
        } else {
          const selectedClick = request.body as { selectedClick: number };
          if (selectedClick.selectedClick === 1) {
            await db.query('UPDATE posts SET nb_clic1 = nb_clic1 + 1 WHERE id = ?', [request.params.id]);
          } else if (selectedClick.selectedClick === 2) {
            await db.query('UPDATE posts SET nb_clic2 = nb_clic2 + 1 WHERE id = ?', [request.params.id]);
          } else {
            reply.status(400);
            return { error: 'Invalid click' };
          }
          reply.send({ result: "success" });
        }
      });
  }

export default routes;