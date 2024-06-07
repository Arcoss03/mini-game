import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_KEY = 'sk-proj-K39HInp9hDoUETRKXe5dT3BlbkFJ8D6Jpqy2JX1yY8oLxvhy';
const API_URL = 'https://api.openai.com/v1/images/generations';

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
      const response = await axios.post(API_URL, {
        prompt,
        n: 1,
        size: '256x256',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      });

      // Log la réponse complète de l'API DALL-E pour débogage
      fastify.log.info({ dalleResponseData: response.data });

      // Vérifier si l'URL de l'image existe
      if (!response.data.data || !response.data.data[0] || !response.data.data[0].url) {
        throw new Error('Invalid response from DALL-E API');
      }

      // Obtenir l'URL de l'image générée
      const imageUrl = response.data.data[0].url;

      // Télécharger l'image à partir de l'URL fournie par DALL-E
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      const uploadsDir = path.join(process.cwd(), 'uploads');
      const imagePath = path.join(uploadsDir, `test.png`);

      // Assurez-vous que le répertoire d'uploads existe
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      fs.writeFileSync(imagePath, imageBuffer);

      reply.send({ success: true, path: imagePath });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to generate image' });
    }
  });
};

export default generateImageRoute;
