import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Chat, Message, User, TypingIndicator } from '../types';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

type AppAction =
  | { type: 'SET_ACTIVE_CHAT'; payload: string | null }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'ADD_CHAT'; payload: Chat }
  | { type: 'UPDATE_CHAT'; payload: { id: string; updates: Partial<Chat> } }
  | { type: 'SET_USERS'; payload: Record<string, User> }
  | { type: 'UPDATE_USER'; payload: { id: string; updates: Partial<User> } }
  | { type: 'SET_CHATS'; payload: Record<string, Chat> }
  | { type: 'SET_MESSAGES'; payload: Record<string, Message[]> }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_TYPING'; payload: { chatId: string; userId: string; isTyping: boolean } }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'MARK_MESSAGES_READ'; payload: { chatId: string; userId: string } };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  sendMessage: (chatId: string, content: string, type?: Message['type']) => void;
  createChat: (participants: string[], name?: string, type?: Chat['type']) => string;
  markAsRead: (chatId: string) => void;
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  searchChats: (query: string) => Chat[];
  searchMessages: (query: string) => Message[];
  findUserByUsername: (username: string) => User | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const initialState: AppState = {
  currentUser: null,
  users: {},
  chats: {},
  messages: {},
  activeChat: null,
  isConnected: true,
  theme: 'light',
  searchQuery: '',
  isTyping: {}
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload };

    case 'ADD_MESSAGE':
      const message = action.payload;
      const chatMessages = state.messages[message.chatId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [message.chatId]: [...chatMessages, message]
        },
        chats: {
          ...state.chats,
          [message.chatId]: {
            ...state.chats[message.chatId],
            lastMessage: message,
            updatedAt: new Date(),
            unreadCount: message.senderId !== state.currentUser?.id 
              ? (state.chats[message.chatId]?.unreadCount || 0) + 1 
              : (state.chats[message.chatId]?.unreadCount || 0)
          }
        }
      };

    case 'UPDATE_MESSAGE':
      const { id, updates } = action.payload;
      const updatedMessages = { ...state.messages };
      
      Object.keys(updatedMessages).forEach(chatId => {
        updatedMessages[chatId] = updatedMessages[chatId].map(msg =>
          msg.id === id ? { ...msg, ...updates } : msg
        );
      });

      return { ...state, messages: updatedMessages };

    case 'ADD_CHAT':
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload.id]: action.payload
        }
      };

    case 'UPDATE_CHAT':
      const { id: chatId, updates: chatUpdates } = action.payload;
      return {
        ...state,
        chats: {
          ...state.chats,
          [chatId]: {
            ...state.chats[chatId],
            ...chatUpdates
          }
        }
      };

    case 'SET_USERS':
      return { ...state, users: action.payload };

    case 'UPDATE_USER':
      const { id: userId, updates: userUpdates } = action.payload;
      return {
        ...state,
        users: {
          ...state.users,
          [userId]: {
            ...state.users[userId],
            ...userUpdates
          }
        }
      };

    case 'SET_CHATS':
      return { ...state, chats: action.payload };

    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SET_TYPING':
      const { chatId: typingChatId, userId: typingUserId, isTyping } = action.payload;
      const currentTyping = state.chats[typingChatId]?.isTyping || [];
      
      let updatedTyping;
      if (isTyping) {
        updatedTyping = currentTyping.includes(typingUserId) 
          ? currentTyping 
          : [...currentTyping, typingUserId];
      } else {
        updatedTyping = currentTyping.filter(id => id !== typingUserId);
      }

      return {
        ...state,
        chats: {
          ...state.chats,
          [typingChatId]: {
            ...state.chats[typingChatId],
            isTyping: updatedTyping
          }
        }
      };

    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };

    case 'MARK_MESSAGES_READ':
      const { chatId: readChatId, userId: readUserId } = action.payload;
      const messagesInChat = state.messages[readChatId] || [];
      
      const updatedChatMessages = messagesInChat.map(msg => 
        msg.senderId !== readUserId && msg.status !== 'read'
          ? { ...msg, status: 'read' as const }
          : msg
      );

      return {
        ...state,
        messages: {
          ...state.messages,
          [readChatId]: updatedChatMessages
        },
        chats: {
          ...state.chats,
          [readChatId]: {
            ...state.chats[readChatId],
            unreadCount: 0
          }
        }
      };

    default:
      return state;
  }
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load users
        const storedUsers = localStorage.getItem('msgram_users');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const userRecords: Record<string, User> = {};
          
          Object.entries(users).forEach(([id, userData]: [string, any]) => {
            userRecords[id] = {
              id: userData.id,
              username: userData.username,
              displayName: userData.displayName,
              avatar: userData.avatar,
              isOnline: userData.isOnline || false,
              lastSeen: new Date(userData.lastSeen),
              bio: userData.bio
            };
          });
          
          dispatch({ type: 'SET_USERS', payload: userRecords });
        }

        // Load chats
        const storedChats = localStorage.getItem('msgram_chats');
        if (storedChats) {
          const chats = JSON.parse(storedChats);
          const chatRecords: Record<string, Chat> = {};
          
          Object.entries(chats).forEach(([id, chatData]: [string, any]) => {
            chatRecords[id] = {
              ...chatData,
              createdAt: new Date(chatData.createdAt),
              updatedAt: new Date(chatData.updatedAt),
              lastMessage: chatData.lastMessage ? {
                ...chatData.lastMessage,
                timestamp: new Date(chatData.lastMessage.timestamp)
              } : undefined
            };
          });
          
          dispatch({ type: 'SET_CHATS', payload: chatRecords });
        }

        // Load messages
        const storedMessages = localStorage.getItem('msgram_messages');
        if (storedMessages) {
          const messages = JSON.parse(storedMessages);
          const messageRecords: Record<string, Message[]> = {};
          
          Object.entries(messages).forEach(([chatId, chatMessages]: [string, any]) => {
            messageRecords[chatId] = chatMessages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
              editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined
            }));
          });
          
          dispatch({ type: 'SET_MESSAGES', payload: messageRecords });
        }

        // Load theme
        const storedTheme = localStorage.getItem('msgram_theme') as 'light' | 'dark';
        if (storedTheme) {
          dispatch({ type: 'SET_THEME', payload: storedTheme });
        }
      } catch (error) {
        console.error('Error loading app data:', error);
      }
    };

    loadData();
  }, []);

  // Update current user in state and initialize demo data
  useEffect(() => {
    if (user) {
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { 
          id: user.id, 
          updates: {
            isOnline: true,
            lastSeen: new Date()
          }
        } 
      });

      // Initialize demo data if no chats exist
      const existingChats = localStorage.getItem('msgram_chats');
      if (!existingChats || Object.keys(JSON.parse(existingChats)).length === 0) {
        import('../utils/demoData').then(({ createDemoChatsAndMessages }) => {
          const { demoChats, demoMessages } = createDemoChatsAndMessages(user.id);
          
          // Save demo data
          localStorage.setItem('msgram_chats', JSON.stringify(demoChats));
          localStorage.setItem('msgram_messages', JSON.stringify(demoMessages));
          
          // Update state
          dispatch({ type: 'SET_CHATS', payload: demoChats });
          dispatch({ type: 'SET_MESSAGES', payload: demoMessages });
        });
      }
    }
  }, [user]);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (Object.keys(state.chats).length > 0) {
      localStorage.setItem('msgram_chats', JSON.stringify(state.chats));
    }
  }, [state.chats]);

  useEffect(() => {
    if (Object.keys(state.messages).length > 0) {
      localStorage.setItem('msgram_messages', JSON.stringify(state.messages));
    }
  }, [state.messages]);

  useEffect(() => {
    localStorage.setItem('msgram_theme', state.theme);
  }, [state.theme]);

  const sendMessage = (chatId: string, content: string, type: Message['type'] = 'text') => {
    if (!user) return;

    const message: Message = {
      id: uuidv4(),
      senderId: user.id,
      chatId,
      content,
      timestamp: new Date(),
      type,
      status: 'sent'
    };

    dispatch({ type: 'ADD_MESSAGE', payload: message });

    // Simulate message delivery
    setTimeout(() => {
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { 
          id: message.id, 
          updates: { status: 'delivered' } 
        } 
      });
    }, 1000);
  };

  const createChat = (participants: string[], name?: string, type: Chat['type'] = 'direct'): string => {
    if (!user) return '';

    const chatId = uuidv4();
    const allParticipants = [user.id, ...participants];

    const chat: Chat = {
      id: chatId,
      name: name || (type === 'direct' 
        ? state.users[participants[0]]?.displayName || 'Unknown User'
        : `Group Chat`),
      type,
      participants: allParticipants,
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isMuted: false
    };

    dispatch({ type: 'ADD_CHAT', payload: chat });
    return chatId;
  };

  const markAsRead = (chatId: string) => {
    if (!user) return;
    dispatch({ 
      type: 'MARK_MESSAGES_READ', 
      payload: { chatId, userId: user.id } 
    });
  };

  const startTyping = (chatId: string) => {
    if (!user) return;
    dispatch({ 
      type: 'SET_TYPING', 
      payload: { chatId, userId: user.id, isTyping: true } 
    });
  };

  const stopTyping = (chatId: string) => {
    if (!user) return;
    dispatch({ 
      type: 'SET_TYPING', 
      payload: { chatId, userId: user.id, isTyping: false } 
    });
  };

  const searchChats = (query: string): Chat[] => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return Object.values(state.chats).filter(chat =>
      chat.name.toLowerCase().includes(lowercaseQuery) ||
      chat.participants.some(participantId => {
        const participant = state.users[participantId];
        return participant?.username.toLowerCase().includes(lowercaseQuery) ||
               participant?.displayName.toLowerCase().includes(lowercaseQuery);
      })
    );
  };

  const searchMessages = (query: string): Message[] => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    const allMessages: Message[] = [];
    
    Object.values(state.messages).forEach(chatMessages => {
      allMessages.push(...chatMessages);
    });

    return allMessages.filter(message =>
      message.content.toLowerCase().includes(lowercaseQuery)
    );
  };

  const findUserByUsername = (username: string): User | null => {
    return Object.values(state.users).find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    ) || null;
  };

  const value: AppContextType = {
    state: {
      ...state,
      currentUser: user
    },
    dispatch,
    sendMessage,
    createChat,
    markAsRead,
    startTyping,
    stopTyping,
    searchChats,
    searchMessages,
    findUserByUsername
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
