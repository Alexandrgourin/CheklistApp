import type { AxiosInstance } from 'axios';

export type ApiInstance = AxiosInstance;

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  token: string;
}
