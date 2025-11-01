import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  const login = (user: string, accessToken: string) => {
    setToken(accessToken);
    setUsername(user);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('username', user);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isAuthenticated: !!token }}>
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
