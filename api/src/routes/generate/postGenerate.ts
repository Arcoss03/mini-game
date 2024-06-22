import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { generateAndStoreImage } from '../../utils/generateImg.utils';

interface GenerateImageRequestBody {
  prompt: string;
}

interface GenerateImageRequest extends FastifyRequest {
  Body: GenerateImageRequestBody;
}

const generateImageRoute = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: GenerateImageRequestBody }>('/', async (request, reply) => {
    const { prompt } = request.body;

    try {
      const imagePath = await generateAndStoreImage(prompt);
      reply.send({ success: true, path: imagePath });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to generate image' });
    }
  });
};

export default generateImageRoute;
