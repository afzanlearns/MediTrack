import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import { syncService } from '../services/syncService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('meditrack_token'));
  const [isGuest, setIsGuest] = useState(localStorage.getItem('meditrack_guest') === 'true');
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('meditrack_token');
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const res = await axios.get('http://localhost:8080/api/auth/me');
          setUser(res.data);
          setToken(storedToken);
          setIsGuest(false);
        } catch (err) {
          localStorage.removeItem('meditrack_token');
          setToken(null);
          delete axios.defaults.headers.common['Authorization'];
          // Fallback to guest if token expired but guest flag was set
          const storedGuest = localStorage.getItem('meditrack_guest');
          setIsGuest(storedGuest === 'true');
        }
      } else {
        const storedGuest = localStorage.getItem('meditrack_guest');
        setIsGuest(storedGuest === 'true');
      }
      setIsLoading(false);
      setIsReady(true);
    };
    initAuth();
  }, []);

  const enterGuestMode = () => {
    localStorage.setItem('meditrack_guest', 'true');
    setIsGuest(true);
    setUser(null);
    setToken(null);
  };

  const login = async (credential) => {
    const wasGuest = isGuest;
    try {
      const res = await axios.post('http://localhost:8080/api/auth/google', { credential });
      const { token: newToken, user: newUser } = res.data;
      
      localStorage.setItem('meditrack_token', newToken);
      localStorage.removeItem('meditrack_guest');
      
      setToken(newToken);
      setUser(newUser);
      setIsGuest(false);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      if (wasGuest) {
        await syncService.syncGuestDataToServer(newToken);
      }
      
      return true;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('meditrack_token');
    localStorage.removeItem('meditrack_guest');
    setToken(null);
    setUser(null);
    setIsGuest(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      isReady,
      isAuthenticated: !!user, 
      isGuest,
      enterGuestMode,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
