import React, { useState, useEffect, createContext, useContext } from 'react';
import api from '../services/api.js';

const DEMO_USER = { id: '550e8400-e29b-41d4-a716-446655440000', username: 'ana_garcia', name: 'Ana García', email: 'ana@wahu.com', croquetas: 150 };

const defaultContext = {
  user: null,
  loading: false,
  login: async () => { throw new Error('AuthProvider not mounted'); },
  loginWithGoogle: async () => { throw new Error('AuthProvider not mounted'); },
  register: async () => { throw new Error('AuthProvider not mounted'); },
  logout: () => {},
};

const AuthContext = createContext(defaultContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('wahu_token');
    if (token) {
      api.me()
        .then(setUser)
        .catch(() => localStorage.removeItem('wahu_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem('wahu_token', token);
    setUser(user);
    return user;
  };

  const loginWithGoogle = async (accessToken) => {
    try {
      const { token, user } = await api.googleAuth(accessToken);
      localStorage.setItem('wahu_token', token);
      setUser(user);
      return user;
    } catch {
      throw new Error('No se pudo conectar al servidor');
    }
  };

  const register = async (data) => {
    const result = await api.register(data);
    // Register now returns { message, email } — user must verify before logging in
    return { pending: true, email: result.email };
  };

  const logout = () => {
    localStorage.removeItem('wahu_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
