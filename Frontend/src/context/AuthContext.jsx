// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
  accessToken: null,
  login: async () => { },
  logout: async () => { },
  register: async () => { },
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const accessTokenRef = useRef(null); // Reference to always hold the latest accessToken
  const navigate = useNavigate();

  // Update the ref whenever accessToken changes
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);


  const attemptSilentRefresh = async () => {
    try {
      const { data } = await api.post('/auth/refresh/', {}, { withCredentials: true });
      setAccessToken(data.access);
      return data.access;
    } catch (err) {
      console.warn('No valid refresh token - user needs to login');
      return null;
    }
  };

  // When accessToken is null or undefined, refresh the token and get a new access token
  useEffect(() => {
    (async () => {
      try {
        await attemptSilentRefresh();
      } finally {
        setInitialized(true);
      }
    })();
  }, []);

  // Change the access token in the request header for all requests
  useEffect(() => {
    const reqI = api.interceptors.request.use((config) => {
      const token = accessTokenRef.current; // Always use the latest token from the ref

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;

      }
      return config;
    });
    return () => api.interceptors.request.eject(reqI);
  }, []);


  // Refresh the token if it's expired , for unauthorized error 
  useEffect(() => {
    const resI = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        const orig = err.config;
        if (err.response?.status === 401 && !orig._retry) {
          orig._retry = true;
          try {
            const newToken = await attemptSilentRefresh();
            if (newToken) {
              orig.headers.Authorization = `Bearer ${newToken}`;
              return api(orig);
            }
          } catch (_refreshErr) {
            setAccessToken(null);
            window.location.href = '/auth/login';
            return Promise.reject(_refreshErr);
          }
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(resI);
  }, []);


  const register = async (userData) => {
    const { data } = await api.post('/auth/register/', userData);
    console.log(data);
    setAccessToken(data.access);
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login/', credentials);
    console.log(data);
    setAccessToken(data.access);
  };

  const logout = async () => {
    await api.post('/auth/logout/', {});
    setAccessToken(null);
  };

  if (!initialized) {
    return <div>Loading authentication…</div>;
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, register, attemptSilentRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
