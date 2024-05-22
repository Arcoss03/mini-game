import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { JwtPayload } from '../../interfaces/JwtPayload';
import { hashPassword,generateRandomSalt } from '../../utils/hash.utils';
import {ModifPassword} from "../../interfaces/user";
import {userSchema} from '../../schemas/userSchema';






async function putProfilRoutes(fastify: FastifyInstance) {
    fastify.addHook('preHandler', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.status(401).send({ error: 'Invalid token' });
        }
    });
    // Route to change password 
    fastify.put('/password', async (request: FastifyRequest<{ Body: ModifPassword }>, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
    
        try {
            const [rows]: any = await fastify.db.query('SELECT password, salt FROM users WHERE id = ?', [payload.id]);
            if (rows.length === 0) {
                reply.status(404).send({ error: 'User not found' });
                return;
            }
            const { oldPassword , newPassword } = request.body;
            const user = rows[0];
            //check if password is correct
            if (user.password !== hashPassword(oldPassword, user.salt)) {
                reply.status(401).send({ error: 'Invalid password' });
                return;
            }
            const pattern = new RegExp(userSchema.properties.password.pattern);
            
            //verifie si ne correspond pas au regex du schema user

            if(typeof newPassword !== userSchema.properties.password.type || newPassword.length < userSchema.properties.password.minLength || !pattern.test(newPassword)){
                reply.status(401).send({ error: 'Invalid password' });
                return;
            }

            const salt = generateRandomSalt(); // Generate a random salt unique to the user
            const hashedPassword = hashPassword(newPassword, salt);
            await fastify.db.query(
                "UPDATE users SET password = ?, salt = ? WHERE id = ?",
                    [hashedPassword, salt, payload.id]
              );
            
            
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });

    // Route to change pseudo
    fastify.put('/pseudo', async (request: FastifyRequest, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
    
        try {
            const pseudo = request.body as string;
            const [rows]: any = await fastify.db.query('SELECT id FROM users WHERE pseudo = ?', [pseudo]);
            if (rows.length != 0) {
                reply.status(404).send({ error: 'Pseudo already used' });
                return;
            }

            const [user]: any = await fastify.db.query('SELECT pseudo FROM users WHERE id = ?', [payload.id]);
            if (user.length === 0) {
                reply.status(404).send({ error: 'User not found' });
                return;
            }
            
            await fastify.db.query(
                "UPDATE users SET pseudo = ? WHERE id = ?",
                    [pseudo, payload.id]
              );
            
            
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });

    // Route to change profil
    fastify.put('/updateProfil', async (request: FastifyRequest, reply: FastifyReply) => {
        const payload = request.user as JwtPayload;
        if (!payload.id) {
            reply.status(401).send({ error: 'Invalid token' });
            return;
        }
    
        try {
            const profil = request.body as JSON;
            
            await fastify.db.query(
                "UPDATE users SET profil = ? WHERE id = ?",
                    [profil, payload.id]
              );
            
            
        } catch (error) {
            reply.status(500).send({ error: 'Database error' });
        }
    });
}
export default putProfilRoutes;