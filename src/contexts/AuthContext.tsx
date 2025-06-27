import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('msgram_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            ...userData,
            lastSeen: new Date(userData.lastSeen),
            createdAt: new Date(userData.createdAt),
            isOnline: true
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('msgram_user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Update online status
  useEffect(() => {
    if (user) {
      const updateOnlineStatus = () => {
        const updatedUser = { ...user, isOnline: true, lastSeen: new Date() };
        setUser(updatedUser);
        localStorage.setItem('msgram_user', JSON.stringify(updatedUser));
      };

      updateOnlineStatus();
      const interval = setInterval(updateOnlineStatus, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored users
      const storedUsers = localStorage.getItem('msgram_users');
      const users = storedUsers ? JSON.parse(storedUsers) : {};

      // Find user
      const foundUser = Object.values(users).find((u: any) => 
        u.username === username && u.password === password
      ) as any;

      if (foundUser) {
        const authUser: AuthUser = {
          id: foundUser.id,
          username: foundUser.username,
          displayName: foundUser.displayName,
          avatar: foundUser.avatar,
          isOnline: true,
          lastSeen: new Date(),
          bio: foundUser.bio,
          email: foundUser.email,
          createdAt: new Date(foundUser.createdAt)
        };

        setUser(authUser);
        localStorage.setItem('msgram_user', JSON.stringify(authUser));
        
        // Update user online status in users database
        const updatedUsers = {
          ...users,
          [foundUser.id]: {
            ...foundUser,
            isOnline: true,
            lastSeen: new Date().toISOString()
          }
        };
        localStorage.setItem('msgram_users', JSON.stringify(updatedUsers));

        return true;
      } else {
        setError('Invalid username or password');
        return false;
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, displayName: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored users
      const storedUsers = localStorage.getItem('msgram_users');
      const users = storedUsers ? JSON.parse(storedUsers) : {};

      // Check if username exists
      const existingUser = Object.values(users).find((u: any) => u.username === username);
      if (existingUser) {
        setError('Username already exists');
        return false;
      }

      // Create new user
      const newUser = {
        id: uuidv4(),
        username,
        password, // In real app, this would be hashed
        displayName,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`,
        isOnline: true,
        lastSeen: new Date().toISOString(),
        bio: 'Hello! I am using Msgram.',
        email: `${username}@msgram.app`,
        createdAt: new Date().toISOString()
      };

      // Save to users database
      const updatedUsers = {
        ...users,
        [newUser.id]: newUser
      };
      localStorage.setItem('msgram_users', JSON.stringify(updatedUsers));

      // Set current user
      const authUser: AuthUser = {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        avatar: newUser.avatar,
        isOnline: true,
        lastSeen: new Date(),
        bio: newUser.bio,
        email: newUser.email,
        createdAt: new Date(newUser.createdAt)
      };

      setUser(authUser);
      localStorage.setItem('msgram_user', JSON.stringify(authUser));

      return true;
    } catch (error) {
      setError('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      // Update offline status
      const storedUsers = localStorage.getItem('msgram_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = {
          ...users,
          [user.id]: {
            ...users[user.id],
            isOnline: false,
            lastSeen: new Date().toISOString()
          }
        };
        localStorage.setItem('msgram_users', JSON.stringify(updatedUsers));
      }
    }

    setUser(null);
    localStorage.removeItem('msgram_user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
