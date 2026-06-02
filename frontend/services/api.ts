import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_URL}/api/v1`;

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('hawapi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hawapi_token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export interface RegisterInput {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  uuid?: string;
  first_name?: string;
  last_name?: string;
  username: string;
  email?: string;
  role: string;
  token: string;
  token_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface HealthResponse {
  status: string;
  uptime: number;
  database: string;
  timestamp: string;
}

export const authService = {
  register: (data: RegisterInput) =>
    http.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  authenticate: (data: AuthInput) =>
    http.post<AuthResponse>('/auth/authenticate', data).then((r) => r.data),
};

export const healthService = {
  check: () =>
    axios.get<HealthResponse>(`${API_URL}/api/health`).then((r) => r.data),
};

export default http;
