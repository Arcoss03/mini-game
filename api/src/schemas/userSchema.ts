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

export { userSchema };