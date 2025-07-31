# Authentication Guard System

This project now includes a comprehensive authentication system with guards to secure your application. Here's how to use it:

## Overview

The authentication system consists of:

- **JWT Strategy**: Validates JWT tokens and extracts user information
- **Auth Guards**: Protect routes and ensure only authenticated users can access them
- **Decorators**: Mark routes as public or extract current user information
- **Global Guard**: Automatically applies authentication to all routes

## File Structure

```
src/Project/auth/
├── guards/
│   ├── jwt.strategy.ts      # JWT token validation strategy
│   ├── jwt-auth.guard.ts    # Route-level authentication guard
│   └── app.guard.ts         # Global authentication guard
├── decorators/
│   ├── current-user.decorator.ts  # Extract current user from request
│   └── public.decorator.ts        # Mark routes as public
└── auth.module.ts           # Auth module with all providers
```

## How to Use

### 1. Public Routes (No Authentication Required)

Use the `@Public()` decorator to mark routes that don't require authentication:

```typescript
import { Public } from './auth/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    // This route is accessible without authentication
  }

  @Public()
  @Post('register')
  async register(@Body() body: SignupDto) {
    // This route is accessible without authentication
  }
}
```

### 2. Protected Routes (Authentication Required)

By default, all routes require authentication. You can protect specific controllers or routes:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard) // Protect entire controller
export class UsersController {
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return {
      message: 'This is a protected route',
      user: {
        id: user.userId,
        email: user.email,
        username: user.user.username,
      },
    };
  }
}
```

### 3. Accessing Current User

Use the `@CurrentUser()` decorator to get the authenticated user:

```typescript
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Get('me')
getCurrentUser(@CurrentUser() user: any) {
  return {
    id: user.userId,
    email: user.email,
    username: user.user.username,
  };
}
```

## API Endpoints

### Public Endpoints (No Auth Required)

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /` - Hello world (public)

### Protected Endpoints (Auth Required)

- `GET /users` - Get all users
- `GET /users/profile` - Get current user profile

## Authentication Flow

1. **Registration**: User registers via `/auth/register`
2. **Login**: User logs in via `/auth/login` and receives JWT tokens
3. **Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Token Validation**: JWT strategy validates token and extracts user info

## Environment Variables

Make sure to set these environment variables:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/your-database
```

## Testing the Authentication

### 1. Register a new user:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

### 2. Login to get JWT token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Access protected route with token:

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Security Features

- **JWT Token Validation**: All tokens are validated on each request
- **User Verification**: JWT strategy verifies user exists in database
- **Public Route Support**: Easy to mark specific routes as public
- **Global Protection**: All routes protected by default
- **User Context**: Easy access to authenticated user information

## Error Handling

- **401 Unauthorized**: Invalid or missing JWT token
- **401 Unauthorized**: User not found in database
- **401 Unauthorized**: Expired JWT token

The authentication system is now fully integrated and ready to use!
