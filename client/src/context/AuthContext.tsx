import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/api.types';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  updateUser: (updatedUser: Partial<AuthResponse['user']>) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          if (userData && userData.user) {
            setUser(userData.user);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            authService.logout();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAuthenticated(false);
          authService.logout();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  const updateUser = useCallback((updatedUser: Partial<AuthResponse['user']>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { 
        ...prevUser, 
        ...updatedUser 
      } as AuthResponse['user'];
    });
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      login: async () => {},
      register: async () => {},
      logout: () => {},
      isAuthenticated: false,
      loading: false,
      updateUser: () => {}
    } as AuthContextType;
  }
  return context;
};
