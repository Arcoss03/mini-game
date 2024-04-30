import { FastifyInstance, FastifyRequest } from 'fastify';
import db from '../db';
import type { User } from '../interfaces/user.interface';
import { generateRandomSalt, hashPassword } from '../utils/hash.utils';

// Define the JSON Schema for user creation
const userSchema = {
    type: 'object',
    required: ['pseudo', 'email', 'password'],
    properties: {
        pseudo: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        password: {
            type: 'string',
            minLength: 8,
            pattern: "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).*" // Requires at least one number, one letter, and one special character
        }
    }
};

// Route for creating a new user
async function routes(fastify: FastifyInstance) {
    fastify.post('/users', {
        schema: {
            body: userSchema
        }
    }, async (request: FastifyRequest<{ Body: User }>, reply) => {
        const { pseudo, email, password } = request.body;
        const salt = generateRandomSalt();
        const hashedPassword = hashPassword(password, salt);

        try {
            await db.query(
                'INSERT INTO users (pseudo, email, password, salt, creation_date) VALUES (?, ?, ?, ?, ?)',
                [pseudo, email, hashedPassword, salt, new Date()]
            );
            reply.send({ result: "success", message: "User created successfully" });
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                let message = 'Unknown error';
                if (error.sqlMessage.includes('email')) {
                    message = 'Email already exists';
                } else if (error.sqlMessage.includes('pseudo')) {
                    message = 'Pseudo already exists';
                }
                reply.status(409).send({ error: message });
            } else {
                request.log.error(error);
                reply.status(500).send({ error: "An error occurred while creating the user" });
            }
        }
    });
}

export default routes;
