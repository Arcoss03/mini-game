import { FastifyInstance, FastifyRequest } from 'fastify';
import type { User, UserLogin } from '../interfaces/user.interface';
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

interface JwtPayload {
    id: number;  // Assuming 'id' is a number. Adjust the type if necessary.
    // You can add more fields here as per your JWT payload structure.
}

// Route for creating a new user
async function routes(fastify: FastifyInstance) {
    fastify.post('/', {
        schema: {
            body: userSchema
        }
    }, async (request: FastifyRequest<{ Body: User }>, reply) => {
        const { pseudo, email, password } = request.body;
        const salt = generateRandomSalt();
        const hashedPassword = hashPassword(password, salt);

        try {
            await fastify.db.query(
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

    // login with password and email or pseudo
    
    fastify.post('/login',async (request: FastifyRequest<{ Body: UserLogin }>, reply) => {
        const { username, password } = request.body;
        const [rows]: any = await fastify.db.query('SELECT * FROM users WHERE email = ? OR pseudo = ?', [username, username]);
        if (rows.length === 0) {
            reply.status(404);
            return { error: 'User not found' };
        }
        const user = rows[0];
        if (user.password !== hashPassword(password, user.salt)) {
            reply.status(401);
            return { error: 'Invalid password' };
        }
        const token = fastify.jwt.sign({ id: user.id });
        return { token, user: { id: user.id, pseudo: user.pseudo, email: user.email } };

    });

    //token login: check if the token is valid must return the user and use bearer token
    fastify.post('/token', async (request: FastifyRequest, reply) => {
        try {
            await request.jwtVerify();
            const res = request.user as JwtPayload;
            if (!res.id) { // Assuming 'id' is a required field in the JWT payload
                reply.status(401).send({ error: 'Invalid token' });
            }
            const user = await fastify.db.query('SELECT id, pseudo, email FROM users WHERE id = ?', [res.id]);
            return { user: user[0] };
            
        } catch (error) {
            reply.status(401).send({ error: 'Invalid token' });
        }
    });

}

export default routes;
