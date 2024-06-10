// function to hash password with salt and sha256

import crypto from 'crypto';

function generateRandomSalt(): Buffer {
    return crypto.randomBytes(16);
}

function hashPassword(password: string, salt: Buffer): string {
    // Create a SHA-256 hasher
    const hasher = crypto.createHash('sha256');
    // Update the hasher with the password and the salt
    hasher.update(password + salt);
    // Get the hash in hexadecimal format
    return hasher.digest('hex');
}


function hashChat(pseudo: string): string {
    // Create a SHA-256 hasher
    const hasher = crypto.createHash('sha256');
    hasher.update(pseudo + pseudo + pseudo + hasher + pseudo );
    // Get the hash in hexadecimal format
    return hasher.digest('hex');
}

//function to verify password
function verifyPassword(password: string, salt: Buffer, hash: string): boolean {
    return hash === hashPassword(password, salt);
}

export { generateRandomSalt, hashPassword, verifyPassword,hashChat };


