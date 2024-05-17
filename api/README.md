Here's a `README.md` for the API routes defined in the Fastify application you provided. This document includes descriptions of the endpoints, required request bodies, and expected responses for each API route.

# API Documentation for User Authentication

This document outlines the authentication and user management routes available in the Fastify server.

## Routes

### 1. Create User

**Endpoint:** `/auth`

**Method:** `POST`

**Description:**  
Allows clients to create a new user account.

**Request Body Schema:**
```json
{
  "pseudo": "string (required)",
  "email": "string (required, must be a valid email format)",
  "password": "string (required, minimum length 8, must contain at least one number, one letter, and one special character)"
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "result": "success",
  "message": "User created successfully"
}
```

**Error Response:**
- **Code:** 409 Conflict
- **Content:**
```json
{
  "error": "Email already exists" // Or "Pseudo already exists"
}
```
- **Code:** 500 Internal Server Error
- **Content:**
```json
{
  "error": "An error occurred while creating the user"
}
```

### 2. User Login

**Endpoint:** `/auth/login`

**Method:** `POST`

**Description:**  
Allows users to log in using either their email or pseudo along with their password.

**Request Body Schema:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "pseudo": "user_pseudo",
    "email": "user_email"
  }
}
```

**Error Response:**
- **Code:** 404 Not Found
- **Content:**
```json
{
  "error": "User not found"
}
```
- **Code:** 401 Unauthorized
- **Content:**
```json
{
  "error": "Invalid password"
}
```

### 3. Token Verification

**Endpoint:** `/auth/token`

**Method:** `POST`

**Description:**  
Verifies the validity of a JWT token provided by the user. Returns user details if the token is valid.

**Authorization:**
Bearer Token (JWT)

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "user": {
    "id": "user_id",
    "pseudo": "user_pseudo",
    "email": "user_email"
  }
}
```

**Error Response:**
- **Code:** 401 Unauthorized
- **Content:**
```json
{
  "error": "Invalid token"
}
```