import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  phone?: string;
  role: string;
  isAdmin?: boolean;
  addresses: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

interface RegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' | 'REGISTER_START' | 'LOAD_USER_START' }
  | { type: 'LOGIN_SUCCESS' | 'REGISTER_SUCCESS' | 'LOAD_USER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAIL'; payload: string }
  | { type: 'LOGOUT' | 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
    case 'LOAD_USER_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    error: null
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (state.token) {
      loadUser();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      console.log('Attempting login with API URL:', API_URL);
      
      const res = await axios.post(`${API_URL}/auth/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const { user, token } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token } 
      });
    } catch (error: any) {
      let message = 'Login failed';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        message = error.response.data.errors.map((e: any) => e.msg).join(', ');
      } else if (error.response?.status === 401) {
        message = 'Invalid email or password';
      } else if (error.response?.status === 400) {
        message = 'Please check your email and password';
      } else if (error.message === 'Network Error') {
        message = 'Network error - is the backend server running on port 5001?';
      } else if (error.code === 'ECONNREFUSED') {
        message = 'Cannot connect to server. Make sure backend is running.';
      }
      
      console.error('Login error:', error);
      dispatch({ type: 'AUTH_FAIL', payload: message });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      console.log('Attempting registration with API URL:', API_URL);
      
      const res = await axios.post(`${API_URL}/auth/register`, userData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const { user, token } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: { user, token } 
      });
    } catch (error: any) {
      let message = 'Registration failed';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        message = error.response.data.errors.map((e: any) => e.msg).join(', ');
      } else if (error.response?.status === 400) {
        message = 'Please check your input and try again';
      } else if (error.message === 'Network Error') {
        message = 'Network error - is the backend server running on port 5001?';
      }
      
      console.error('Registration error:', error);
      dispatch({ type: 'AUTH_FAIL', payload: message });
      throw error;
    }
  };

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      dispatch({ type: 'LOAD_USER_START' });
      const res = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      dispatch({ 
        type: 'LOAD_USER_SUCCESS', 
        payload: { user: res.data.data.user, token } 
      });
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_FAIL', payload: 'Session expired' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (user: User) => {
    dispatch({ 
      type: 'LOAD_USER_SUCCESS', 
      payload: { user, token: state.token || '' } 
    });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      loadUser,
      clearError,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};