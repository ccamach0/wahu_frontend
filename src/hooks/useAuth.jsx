import React, { useState, useEffect, createContext, useContext } from 'react';
import api from '../services/api.js';

const DEMO_USER = { id: 'demo', username: 'ana_garcia', name: 'Ana García', email: 'ana@wahu.com', croquetas: 150 };

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
        .catch(() => {
          if (token === 'demo_token') {
            setUser(DEMO_USER);
          } else {
            localStorage.removeItem('wahu_token');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user } = await api.login({ email, password });
      localStorage.setItem('wahu_token', token);
      setUser(user);
      return user;
    } catch (err) {
      // Demo mode fallback
      if (email === 'ana@wahu.com' && password === 'password123') {
        localStorage.setItem('wahu_token', 'demo_token');
        setUser(DEMO_USER);
        return DEMO_USER;
      }
      throw err;
    }
  };

  const loginWithGoogle = async (accessToken) => {
    try {
      const { token, user } = await api.googleAuth(accessToken);
      localStorage.setItem('wahu_token', token);
      setUser(user);
      return user;
    } catch {
      // Demo fallback: obtener info básica de Google sin backend
      try {
        const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
        if (res.ok) {
          const { name, email, picture } = await res.json();
          const demoUser = { id: 'google_demo', username: email.split('@')[0], name, email, avatar_url: picture, croquetas: 0 };
          localStorage.setItem('wahu_token', 'demo_token');
          setUser(demoUser);
          return demoUser;
        }
      } catch {}
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
