// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext({
  accessToken: null,
  signin: async () => {},
  signout: () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const attemptSilentRefresh = async () => {
    try {
      const { data } = await api.post('/auth/refresh', null, {
        withCredentials: true,
      });
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (err) {
      console.warn('No valid refresh token - user needs to sign in');
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await attemptSilentRefresh();
      } finally {
        setInitialized(true);
      }
    })();
  }, []);


  // change the access token in the request header for all requests
  useEffect(() => {
    const reqI = api.interceptors.request.use(config => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(reqI);
  }, [accessToken]);


  // refresh the token if it's expired
  useEffect(() => {
    const resI = api.interceptors.response.use(
      res => res,
      async err => {
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
            window.location.href = '/login';
            return Promise.reject(_refreshErr);
          }
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(resI);
  }, [accessToken]);



  const register = async (userData) => {
    const { data } = await api.post('/auth/register/', userData, {
      withCredentials: true,
    });

    console.log(data);
    setAccessToken(data.accessToken);
  };


  const signin = async (credentials) => {
    const { data } = await api.post('/auth/login/', credentials, {
      withCredentials: true,
    });
    console.log(data)
    setAccessToken(data.accessToken);
  };


  const signout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    setAccessToken(null);
  };

  if (!initialized) {
    return <div>Loading authentication…</div>;
  }

  return (
    <AuthContext.Provider value={{ accessToken, signin, signout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
