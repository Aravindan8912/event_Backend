# Frontend Integration Guide

## 🚀 Backend Setup (Already Done)

Your NestJS backend is already configured with CORS and ready for frontend integration:

- **Base URL**: `http://localhost:3000/api`
- **CORS**: Enabled for all common frontend ports
- **Authentication**: JWT Bearer tokens

## 📋 API Endpoints for Frontend

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| `POST` | `/api/auth/register` | Register new user | ❌            |
| `POST` | `/api/auth/login`    | Login user        | ❌            |
| `GET`  | `/api/users/profile` | Get user profile  | ✅            |
| `GET`  | `/api/users`         | Get all users     | ✅            |

## 🔧 Frontend Integration Examples

### 1. React.js Integration

#### Setup API Service

```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Set auth token
  setAuthToken(token) {
    localStorage.setItem('accessToken', token);
  }

  // Get auth token
  getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem('accessToken');
  }

  // API request helper
  async request(endpoint, options = {}) {
    const token = this.getAuthToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Register user
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Login user
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.accessToken) {
      this.setAuthToken(response.accessToken);
    }

    return response;
  }

  // Get user profile
  async getProfile() {
    return this.request('/users/profile');
  }

  // Get all users
  async getAllUsers() {
    return this.request('/users');
  }

  // Logout
  logout() {
    this.removeAuthToken();
  }
}

export default new ApiService();
```

#### React Components

```jsx
// src/components/Register.jsx
import React, { useState } from 'react';
import apiService from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.register(formData);
      setSuccess('Registration successful!');
      setError('');
      console.log('Registered user:', response);
    } catch (err) {
      setError('Registration failed: ' + err.message);
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
```

```jsx
// src/components/Login.jsx
import React, { useState } from 'react';
import apiService from '../services/api';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.login(credentials);
      console.log('Login successful:', response);
      // Redirect or update app state
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
```

```jsx
// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiService.getProfile();
      setProfile(data.user);
    } catch (err) {
      setError('Failed to load profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    // Redirect to login
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Profile</h2>
      {profile && (
        <div>
          <p>
            <strong>ID:</strong> {profile.id}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
```

### 2. Angular Integration

#### Setup API Service

```typescript
// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseURL}/auth/login`, credentials);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseURL}/users/profile`, {
      headers: this.getHeaders(),
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseURL}/users`, {
      headers: this.getHeaders(),
    });
  }

  logout(): void {
    localStorage.removeItem('accessToken');
  }
}
```

#### Angular Components

```typescript
// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  template: `
    <div>
      <h2>Register</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label>Username:</label>
          <input [(ngModel)]="formData.username" name="username" required />
        </div>
        <div>
          <label>Email:</label>
          <input
            [(ngModel)]="formData.email"
            name="email"
            type="email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            [(ngModel)]="formData.password"
            name="password"
            type="password"
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  `,
})
export class RegisterComponent {
  formData = {
    username: '',
    email: '',
    password: '',
  };

  constructor(private apiService: ApiService) {}

  onSubmit() {
    this.apiService.register(this.formData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }
}
```

### 3. Vue.js Integration

#### Setup API Service

```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const authService = {
  register(userData) {
    return api.post('/auth/register', userData);
  },

  login(credentials) {
    return api.post('/auth/login', credentials).then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      return response;
    });
  },

  logout() {
    localStorage.removeItem('accessToken');
  },

  getProfile() {
    return api.get('/users/profile');
  },

  getAllUsers() {
    return api.get('/users');
  },
};

export default api;
```

#### Vue Components

```vue
<!-- src/components/Register.vue -->
<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Username:</label>
        <input v-model="formData.username" type="text" required />
      </div>
      <div>
        <label>Email:</label>
        <input v-model="formData.email" type="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="formData.password" type="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { authService } from '../services/api';

export default {
  name: 'Register',
  data() {
    return {
      formData: {
        username: '',
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await authService.register(this.formData);
        console.log('Registration successful:', response.data);
      } catch (error) {
        console.error('Registration failed:', error);
      }
    },
  },
};
</script>
```

## 🔧 Environment Configuration

### Frontend Environment Variables

Create `.env` files in your frontend project:

```env
# React (.env)
REACT_APP_API_URL=http://localhost:3000/api

# Angular (environment.ts)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

# Vue (.env)
VUE_APP_API_URL=http://localhost:3000/api
```

## 🚨 Common Issues & Solutions

### 1. CORS Errors

- **Solution**: Backend CORS is already configured
- **Check**: Make sure backend is running on port 3000

### 2. Authentication Token Issues

- **Solution**: Store token in localStorage
- **Check**: Include `Authorization: Bearer TOKEN` header

### 3. Network Errors

- **Solution**: Verify API URL is correct
- **Check**: Backend server is running

### 4. Token Expiration

- **Solution**: Implement token refresh or redirect to login
- **Check**: Tokens expire after 15 minutes

## 📱 Mobile App Integration

### React Native

```javascript
// api.js
const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
  async request(endpoint, options = {}) {
    const token = await AsyncStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });
    return response.json();
  },

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.accessToken) {
      await AsyncStorage.setItem('accessToken', response.accessToken);
    }

    return response;
  },
};
```

## 🎯 Testing Frontend Integration

1. **Start Backend**: `npm run start:dev`
2. **Start Frontend**: Your frontend dev server
3. **Test Registration**: Create a new user
4. **Test Login**: Authenticate user
5. **Test Protected Routes**: Access profile with token

## 💡 Best Practices

- **Error Handling**: Always handle API errors gracefully
- **Loading States**: Show loading indicators during API calls
- **Token Management**: Store tokens securely (localStorage for web, AsyncStorage for mobile)
- **Route Protection**: Protect routes that require authentication
- **Logout**: Clear tokens and redirect to login on logout

Your backend is ready for frontend integration! 🚀
