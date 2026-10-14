import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setStoredToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('smart_mentor_jwt_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session from token
  useEffect(() => {
    async function loadCurrentUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.auth.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.token) {
        setStoredToken(res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
      }
      throw new Error(res.error || 'Login failed.');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const demoLogin = async (role) => {
    setError(null);
    try {
      const res = await api.auth.demoLogin(role);
      if (res.success && res.token) {
        setStoredToken(res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
      }
      throw new Error(res.error || 'Demo login failed.');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await api.auth.register(userData);
      if (res.success && res.token) {
        setStoredToken(res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
      }
      throw new Error(res.error || 'Registration failed.');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    setError(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(user && token),
    loading,
    error,
    login,
    demoLogin,
    register,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
