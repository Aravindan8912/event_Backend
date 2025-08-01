# 🚀 Quick Postman Testing Reference

## 📋 API Endpoints

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| `POST` | `/api/auth/register` | Register new user | ❌            |
| `POST` | `/api/auth/login`    | Login user        | ❌            |
| `GET`  | `/api/users/profile` | Get user profile  | ✅            |
| `GET`  | `/api/users`         | Get all users     | ✅            |

## 🔑 Quick Test Commands

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

### 2. Login User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

### 3. Get Profile (with token)

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📝 Postman Quick Setup

### 1. Register Request

- **URL**: `http://localhost:3000/api/auth/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "email": "testuser@example.com",
  "password": "password123",
  "username": "testuser"
}
```

### 2. Login Request

- **URL**: `http://localhost:3000/api/auth/login`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

### 3. Profile Request

- **URL**: `http://localhost:3000/api/users/profile`
- **Method**: `GET`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_ACCESS_TOKEN`

## ✅ Expected Responses

### Registration Success (201)

```json
{
  "_id": "user_id_here",
  "email": "testuser@example.com",
  "username": "testuser",
  "password": "hashed_password_here",
  "__v": 0
}
```

### Login Success (200)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Profile Success (200)

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

## 🚨 Common Error Codes

| Status | Error        | Cause                           |
| ------ | ------------ | ------------------------------- |
| `400`  | Bad Request  | Invalid data, validation failed |
| `401`  | Unauthorized | Missing or invalid token        |
| `404`  | Not Found    | Endpoint doesn't exist          |
| `500`  | Server Error | Database or server issue        |

## 🔧 Environment Setup

Make sure your `.env` file has:

```env
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb://localhost:27017/event_Back
PORT=3000
```

## 🎯 Testing Flow

1. **Start server**: `npm run start:dev`
2. **Register user**: POST `/api/auth/register`
3. **Login user**: POST `/api/auth/login`
4. **Copy access token** from login response
5. **Test protected route**: GET `/api/users/profile` with `Authorization: Bearer TOKEN`

## 💡 Tips

- Always check the response status code
- Copy the `accessToken` from login response
- Use `Bearer TOKEN` format in Authorization header
- Test both success and failure scenarios
- Check MongoDB connection if getting 500 errors
