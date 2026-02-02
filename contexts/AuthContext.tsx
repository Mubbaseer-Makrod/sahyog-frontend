"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, User, LoginCredentials, AuthResponse } from '@/types';
import { apiClient } from '@/lib/api';
import { setAuthToken, getUserData, setUserData, clearAuthData, getAuthToken } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Try to get user data from localStorage first
      const cachedUser = getUserData();
      if (cachedUser) {
        setUser(cachedUser);
        setIsLoading(false);
        
        // Verify token with backend in background
        try {
          const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.ME);
          setUser(response.user);
          setUserData(response.user);
        } catch (error) {
          // Token invalid, clear auth
          clearAuthData();
          setUser(null);
        }
        return;
      }

      // No cached user, verify with backend
      const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.ME);
      setUser(response.user);
      setUserData(response.user);
    } catch (error) {
      clearAuthData();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call when backend is ready
      // For now, use mock authentication
      if (email === 'admin@sahyogfarm.com' && password === 'admin123') {
        const mockResponse: AuthResponse = {
          user: {
            id: '1',
            email: 'admin@sahyogfarm.com',
            name: 'Admin',
            role: 'admin',
          },
          token: 'mock-jwt-token-' + Date.now(),
        };

        setAuthToken(mockResponse.token);
        setUserData(mockResponse.user);
        setUser(mockResponse.user);
        router.push('/admin/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }

      // Actual API call (uncomment when backend is ready):
      /*
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.LOGIN,
        { email, password }
      );

      setAuthToken(response.token);
      setUserData(response.user);
      setUser(response.user);
      router.push('/admin/dashboard');
      */
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    router.push('/admin/login');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
