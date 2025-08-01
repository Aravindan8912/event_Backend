# Postman Testing Guide for Authentication System

This guide will show you how to test your authentication system using Postman.

## Prerequisites

1. Make sure your NestJS server is running:

   ```bash
   npm run start:dev
   ```

2. Your server should be running on `http://localhost:3000`

## Step 1: Register a New User

### Request Details:

- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/register`
- **Headers**:
  - `Content-Type: application/json`

### Body (raw JSON):

```json
{
  "email": "testuser@example.com",
  "password": "password123",
  "username": "testuser"
}
```

### Expected Response:

```json
{
  "_id": "user_id_here",
  "email": "testuser@example.com",
  "username": "testuser",
  "password": "hashed_password_here",
  "__v": 0
}
```

## Step 2: Login to Get JWT Token

### Request Details:

- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/login`
- **Headers**:
  - `Content-Type: application/json`

### Body (raw JSON):

```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

### Expected Response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Important**: Copy the `accessToken` value - you'll need it for protected routes!

## Step 3: Test Public Route (No Auth Required)

### Request Details:

- **Method**: GET
- **URL**: `http://localhost:3000/api/`
- **Headers**: None required

### Expected Response:

```
Hello World!
```

## Step 4: Test Protected Route (Auth Required)

### Request Details:

- **Method**: GET
- **URL**: `http://localhost:3000/api/users/profile`
- **Headers**:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

Replace `YOUR_ACCESS_TOKEN_HERE` with the actual token from Step 2.

### Expected Response:

```json
{
  "message": "This is a protected route",
  "user": {
    "id": "user_id_here",
    "email": "testuser@example.com",
    "username": "testuser"
  }
}
```

## Step 5: Test Protected Route Without Token (Should Fail)

### Request Details:

- **Method**: GET
- **URL**: `http://localhost:3000/api/users/profile`
- **Headers**: None

### Expected Response:

```json
{
  "statusCode": 401,
  "message": "Authentication required"
}
```

## Step 6: Test Get All Users (Protected Route)

### Request Details:

- **Method**: GET
- **URL**: `http://localhost:3000/api/users`
- **Headers**:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

### Expected Response:

```json
[
  {
    "_id": "user_id_here",
    "email": "testuser@example.com",
    "username": "testuser",
    "password": "hashed_password_here",
    "__v": 0
  }
]
```

## Postman Collection Setup

### 1. Create a New Collection

1. Open Postman
2. Click "New" → "Collection"
3. Name it "Event Backend API"

### 2. Create Environment Variables

1. Click the "Environments" tab
2. Click "New Environment"
3. Name it "Local Development"
4. Add these variables:
   - `baseUrl`: `http://localhost:3000/api`
   - `accessToken`: (leave empty for now)

### 3. Create Request Folders

Create these folders in your collection:

- **Auth** (for authentication requests)
- **Users** (for user-related requests)

### 4. Create Requests

#### Auth/Register

- Method: POST
- URL: `{{baseUrl}}/auth/register`
- Headers: `Content-Type: application/json`
- Body: Raw JSON (see Step 1)

#### Auth/Login

- Method: POST
- URL: `{{baseUrl}}/auth/login`
- Headers: `Content-Type: application/json`
- Body: Raw JSON (see Step 2)
- **Tests Tab** (to automatically save token):

```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set('accessToken', response.accessToken);
}
```

#### Users/Get Profile

- Method: GET
- URL: `{{baseUrl}}/users/profile`
- Headers: `Authorization: Bearer {{accessToken}}`

#### Users/Get All Users

- Method: GET
- URL: `{{baseUrl}}/users`
- Headers: `Authorization: Bearer {{accessToken}}`

## Testing Scenarios

### ✅ Success Scenarios:

1. **Register** → Should return user data
2. **Login** → Should return access token
3. **Access protected route with valid token** → Should return user profile
4. **Access public route without token** → Should work

### ❌ Failure Scenarios:

1. **Access protected route without token** → Should return 401
2. **Access protected route with invalid token** → Should return 401
3. **Login with wrong password** → Should return 401
4. **Register with existing email** → Should return error

## Troubleshooting

### Common Issues:

1. **"Cannot connect to server"**
   - Make sure your NestJS server is running
   - Check if it's running on port 3000

2. **"401 Unauthorized" on protected routes**
   - Make sure you're including the `Authorization: Bearer <token>` header
   - Check if the token is valid and not expired
   - Verify the token format: `Bearer <your_token_here>`

3. **"User not found" error**
   - Make sure you registered the user first
   - Check if the email exists in the database

4. **"Invalid token" error**
   - The token might be expired (tokens expire after 15 minutes)
   - Login again to get a fresh token

### Environment Variables Check:

Make sure your `.env` file has:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/event_Back
```

## Quick Test Checklist

- [ ] Server is running on `http://localhost:3000`
- [ ] Can register a new user
- [ ] Can login and get access token
- [ ] Can access public route (`GET /api/`)
- [ ] Cannot access protected route without token
- [ ] Can access protected route with valid token
- [ ] Token expires after 15 minutes (optional test)

Your authentication system is working correctly if all these tests pass! 🎉
