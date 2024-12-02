import { api } from '../utils/api';
import type { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse 
} from '../types/api.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return api.get('/auth/me').then(response => response.data);
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const currentTime = Date.now() / 1000;
      return decodedPayload.exp > currentTime;
    } catch {
      return false;
    }
  }
};
