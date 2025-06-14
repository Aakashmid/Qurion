import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import CirculareL1 from '../components/Loaders/CirculareL1';
import { checkServerStatus } from '../services/apiServices';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [shouldRedirectToError, setShouldRedirectToError] = useState(false);
  const accessTokenRef = useRef(null);
  const serverStatusRef = useRef('checking');
  const { setUser } = useSidebar();
  const navigate = useNavigate();

  const location= useLocation();

  // Update refs when state changes
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    serverStatusRef.current = serverStatus;
  }, [serverStatus]);

  // Handle navigation to server error page
  useEffect(() => {
    if (shouldRedirectToError && location.pathname !== '/server-error') {
      navigate('/server-error');
      setShouldRedirectToError(false);
    }
  }, [shouldRedirectToError, navigate]);

  // Handle server status changes
  useEffect(() => {
    if (serverStatus === 'offline' && initialized) {
      setShouldRedirectToError(true);
    }
  }, [serverStatus, initialized]);

  useEffect(() => {
    if (accessToken && serverStatus === 'online') {
      const fetchUserData = async () => {
        const user = await authActions.fetchUser();
        if (user) {
          setUser(user);
        }
      };
      fetchUserData();
    }
  }, [accessToken, serverStatus, setUser]);

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
      setAccessToken(null);
      return null;
    }
  };

  // Server health check function
  const performHealthCheck = async () => {
    try {
      await checkServerStatus();
      setServerStatus('online');
      return true;
    } catch (error) {
      console.error('Server health check failed:', error);
      setServerStatus('offline');
      return false;
    }
  };

  // Initialize application with server health check
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First check server status
        const isServerOnline = await performHealthCheck();
        
        if (isServerOnline) {
          // Only attempt auth refresh if server is online
          await attemptSilentRefresh();
        }
      } catch (error) {
        console.error('App initialization error:', error);
        setServerStatus('offline');
      } finally {
        setInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Request interceptor
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // Block requests if server is offline
        if (serverStatusRef.current === 'offline') {
          return Promise.reject(new Error('Server is offline'));
        }

        const token = accessTokenRef.current;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.request.eject(requestInterceptor);
  }, []);

  // Response interceptor with enhanced error handling
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle server errors (5xx status codes)
        if (error.response?.status >= 500) {
          console.error('Server error detected:', error.response.status);
          setServerStatus('offline');
          return Promise.reject(error);
        }

        // Handle network errors or no response (server completely down)
        if (!error.response) {
          console.error('Network error or server unreachable:', error.message);
          setServerStatus('offline');
          return Promise.reject(error);
        }

        // Handle 401 errors (authentication)
        if (error.response?.status === 401 && !originalRequest._retry && accessTokenRef.current) {
          originalRequest._retry = true;

          try {
            const newToken = await attemptSilentRefresh();
            if (newToken) {
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
      if (serverStatus === 'offline') {
        throw new Error('Server is offline');
      }
      const { data } = await api.post('/auth/register/', userData);
      handleAuthResponse(data);
    },

    login: async (credentials) => {
      if (serverStatus === 'offline') {
        throw new Error('Server is offline');
      }
      const { data } = await api.post('/auth/login/', credentials);
      handleAuthResponse(data);
    },

    logout: async () => {
      try {
        if (serverStatus === 'online') {
          await api.post('/auth/logout/', {});
        }
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        setAccessToken(null);
        setUser(null);
      }
    },

    deleteAccount: async () => {
      if (serverStatus === 'offline') {
        throw new Error('Server is offline');
      }
      try {
        await api.delete('/user/');
      } catch (error) {
        console.error('Error deleting account:', error);
      } finally {
        setAccessToken(null);
        setUser(null);
      }
    },

    fetchUser: async () => {
      if (serverStatus === 'offline') {
        return null;
      }
      try {
        const { data } = await api.get('/user/');
        return data;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },

    // Method to retry server connection
    retryServerConnection: async () => {
      setServerStatus('checking');
      console.log('checking')
      const isOnline = await performHealthCheck();
      console.log(location.pathname)
      if (isOnline && location.pathname === '/server-error') {
        console.log('server is online')
        navigate('/');
      }
      return isOnline;
    }
  };

  // Show loading screen while initializing
  if (!initialized) {
    return (
      <div className='w-screen h-screen flex-center'>
        <CirculareL1 />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      accessToken, 
      serverStatus, 
      ...authActions, 
      attemptSilentRefresh 
    }}>
      {children}
    </AuthContext.Provider>
  );
};