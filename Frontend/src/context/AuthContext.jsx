// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from './SidebarContext';

const AuthContext = createContext({
  accessToken: null,
  login: async () => { },
  logout: async () => { },
  register: async () => { },
  fetchUser: async () => { },
});


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const accessTokenRef = useRef(null);
  const { setUser } = useSidebar();
  const navigate = useNavigate();

  useEffect(() => {
    accessTokenRef.current = accessToken;
    if (accessToken) {
      const user = authActions.fetchUser();
      if (user) {
        setUser(user);
      }
    }
  }, [accessToken]);

  const handleAuthResponse = (data) => {
    setAccessToken(data.access);
    return data.access;
  };

  const attemptSilentRefresh = async () => {
    try {
      const { data } = await api.post('/auth/refresh/', {}, { withCredentials: true });
      return handleAuthResponse(data);
    } catch (err) {
      console.warn('No valid refresh token - user needs to login');
      return null;
    }
  };


  // initializing the accessToken
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await attemptSilentRefresh();
      } finally {
        setInitialized(true);
      }
    };
    initializeAuth();
  }, []);



  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = accessTokenRef.current;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(requestInterceptor);
  }, []);



  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await attemptSilentRefresh();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            setAccessToken(null);
            navigate('/auth/login');
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(responseInterceptor);
  }, [navigate]);


  const authActions = {
    register: async (userData) => {
      const { data } = await api.post('/auth/register/', userData);
      handleAuthResponse(data);
    },

    login: async (credentials) => {
      const { data } = await api.post('/auth/login/', credentials);
      handleAuthResponse(data);
    },

    logout: async () => {
      await api.post('/auth/logout/', {});
      setAccessToken(null);
    },
    fetchUser: async () => {
      try {
        const { data } = await api.get('/auth/user/');
        console.log(data)
        return data;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    }
  };

  if (!initialized) {
    return <div className='text-white'>Loading authentication…</div>;
  }

  return (
    <AuthContext.Provider value={{ accessToken, ...authActions, attemptSilentRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};


