import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { User, LoginFormValues, RegisterFormValues } from '../utils/types';

// Define Auth Context Type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormValues) => Promise<boolean>;
  register: (userData: RegisterFormValues) => Promise<boolean>;
  logout: () => Promise<void>;
  isSeller: boolean;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Check for stored credentials on startup
  useEffect(() => {
    const loadStoredCredentials = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        
        if (token && storedUser) {
          setAuthToken(token);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading credentials from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredCredentials();
  }, []);

  // Configure axios with token when token changes
  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authToken]);

  // Login function
  const login = async (credentials: LoginFormValues): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      if (response.data && response.data.user) {
        const { token, user } = response.data;
        
        // Store token and user in storage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        // Update state
        setAuthToken(token);
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterFormValues): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data && response.data.user) {
        const { token, user } = response.data;
        
        // Store token and user in storage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        // Update state
        setAuthToken(token);
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Clear stored credentials
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      // Clear state
      setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Value object to be provided by the context
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    isSeller: user?.role === 'seller',
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};