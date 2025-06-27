import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { ChatLayout } from './components/chat/ChatLayout';
import { Loader2 } from 'lucide-react';
import './App.css';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Initialize demo users for testing
    const initDemoUsers = () => {
      const existingUsers = localStorage.getItem('msgram_users');
      if (!existingUsers) {
        const demoUsers = {
          'demo-user-1': {
            id: 'demo-user-1',
            username: 'alice',
            password: 'password123',
            displayName: 'Alice Johnson',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alice Johnson',
            isOnline: false,
            lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            bio: 'Love coding and coffee ☕',
            email: 'alice@msgram.app',
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          'demo-user-2': {
            id: 'demo-user-2',
            username: 'bob',
            password: 'password123',
            displayName: 'Bob Smith',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Bob Smith',
            isOnline: true,
            lastSeen: new Date().toISOString(),
            bio: 'Designer & traveler 🌍',
            email: 'bob@msgram.app',
            createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
          },
          'demo-user-3': {
            id: 'demo-user-3',
            username: 'charlie',
            password: 'password123',
            displayName: 'Charlie Wilson',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Charlie Wilson',
            isOnline: false,
            lastSeen: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
            bio: 'Music producer 🎵',
            email: 'charlie@msgram.app',
            createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
          }
        };
        
        localStorage.setItem('msgram_users', JSON.stringify(demoUsers));
      }
    };

    initDemoUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading Msgram...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <AppProvider>
      <ChatLayout />
    </AppProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
