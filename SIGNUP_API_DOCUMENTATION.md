# User Registration API Documentation

## Signup Endpoint

### POST /auth/signup

Creates a new user account with comprehensive registration fields.

### Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1-555-123-4567",
  "accountType": "Individual",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "termsAgreed": true,
  "newsletterSubscribed": false
}
```

### Field Descriptions

| Field                  | Type    | Required | Description                | Validation                                              |
| ---------------------- | ------- | -------- | -------------------------- | ------------------------------------------------------- |
| `firstName`            | string  | ✅       | User's first name          | Min 2 characters                                        |
| `lastName`             | string  | ✅       | User's last name           | Min 2 characters                                        |
| `email`                | string  | ✅       | User's email address       | Valid email format, unique                              |
| `phoneNumber`          | string  | ❌       | User's phone number        | Optional, US format                                     |
| `accountType`          | enum    | ✅       | Account type               | "Individual" or "Business"                              |
| `password`             | string  | ✅       | User's password            | Min 8 chars, uppercase, lowercase, number, special char |
| `confirmPassword`      | string  | ✅       | Password confirmation      | Must match password                                     |
| `termsAgreed`          | boolean | ✅       | Terms of service agreement | Must be true                                            |
| `newsletterSubscribed` | boolean | ❌       | Newsletter subscription    | Optional, defaults to false                             |

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%\*?&)

### Account Types

- `"Individual"` - Personal account
- `"Business"` - Business account

### Response

#### Success (201 Created)

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "accountType": "Individual",
    "emailVerified": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

**400 Bad Request - Validation Errors**

```json
{
  "statusCode": 400,
  "message": [
    "First name must be at least 2 characters long",
    "Please provide a valid email address",
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    "Passwords do not match",
    "You must agree to the Terms of Service"
  ],
  "error": "Bad Request"
}
```

**400 Bad Request - User Already Exists**

```json
{
  "statusCode": 400,
  "message": "User with this email already exists",
  "error": "Bad Request"
}
```

## Login Endpoint

### POST /auth/login

Authenticates a user and returns access tokens.

### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

### Response

#### Success (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "accountType": "Individual",
    "emailVerified": false
  }
}
```

## Profile Endpoints

### GET /users/profile

Get current user's profile (requires authentication).

### Response

```json
{
  "message": "This is a protected route",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-555-123-4567",
    "accountType": "Individual",
    "emailVerified": false,
    "newsletterSubscribed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### PUT /users/profile

Update user's profile (requires authentication).

### Request Body

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1-555-987-6543",
  "newsletterSubscribed": true
}
```

## Email Verification

### GET /users/verify-email/:token

Verify user's email address using verification token.

### Response

```json
{
  "message": "Email verified successfully"
}
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Handling

The API returns appropriate HTTP status codes and error messages for:

- Validation errors (400)
- Authentication failures (401)
- Resource not found (404)
- Server errors (500)

## Example Usage

### 1. Register a new user

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-555-123-4567",
    "accountType": "Individual",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "termsAgreed": true,
    "newsletterSubscribed": false
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Access protected route

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
