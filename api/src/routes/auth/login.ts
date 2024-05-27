import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UserLogin } from '../../interfaces/user';
import { hashPassword } from '../../utils/hash.utils';

async function loginRoutes(fastify: FastifyInstance) {
    fastify.post('/login', async (request: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) => {
        const { username, password } = request.body;
        const [rows]: any = await fastify.db.query('SELECT * FROM users WHERE email = ? OR pseudo = ?', [username, username]);
        if (rows.length === 0) {
            reply.status(404).send({ error: 'User not found' });
            return;
        }
        const user = rows[0];
        //check if password is correct
        if (user.password !== hashPassword(password, user.salt)) {
            reply.status(401).send({ error: 'Invalid password' });
            return;
        }
        const token = fastify.jwt.sign({ id: user.id });
        //return token and user info
        reply.send({ token, user: { id: user.id, pseudo: user.pseudo, email: user.email, profil_picture: user.profil_picture } });
    });
}

export default loginRoutes;
