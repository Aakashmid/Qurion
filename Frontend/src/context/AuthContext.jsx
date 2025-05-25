// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import CirculareL1 from '../components/Loaders/CirculareL1';

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
      const fetchUserData = async () => {
        const user = await authActions.fetchUser();
        if (user) {
          setUser(user);
        }
      };
      fetchUserData();
    }
  }, [accessToken, setUser]);

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
      setAccessToken(null); // Clear the access token
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

  // initializing the api interceptors
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

  // Response interceptor for handling 401 errors
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Only try to refresh the token if:
        //  get a 401 error
        //  haven't already tried to retry this request
        //  have a valid access token reference
        if (error.response?.status === 401 && !originalRequest._retry && accessTokenRef.current) {
          originalRequest._retry = true;

          try {
            const newToken = await attemptSilentRefresh();
            if (newToken) {
              // Update the auth header and retry the original request
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            } else {
              navigate('/auth/login');
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error('Refresh token is invalid or expired:', refreshError);
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
      try {
        await api.post('/auth/logout/', {});
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        setAccessToken(null);
        setUser(null); // Clear user data on logout
      }
    },

    fetchUser: async () => {
      try {
        const { data } = await api.get('/user/');
        return data;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    }
  };

  if (!initialized) {
    return <div className='w-screen h-screen flex-center  '>
      <CirculareL1/>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ accessToken, ...authActions, attemptSilentRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};