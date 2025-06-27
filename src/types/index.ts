// Core Types for Msgram - Telegram Clone

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  bio?: string;
}

export interface Message {
  id: string;
  senderId: string;
  chatId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'image' | 'file';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
  edited?: boolean;
  editedAt?: Date;
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  avatar?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  isTyping?: string[];
  isPinned?: boolean;
  isMuted?: boolean;
}

export interface AuthUser extends User {
  email?: string;
  createdAt: Date;
}

export interface AppState {
  currentUser: AuthUser | null;
  users: Record<string, User>;
  chats: Record<string, Chat>;
  messages: Record<string, Message[]>;
  activeChat: string | null;
  isConnected: boolean;
  theme: 'light' | 'dark';
  searchQuery: string;
  isTyping: Record<string, boolean>;
}

export interface TypingIndicator {
  chatId: string;
  userId: string;
  timestamp: Date;
}

export interface MessageStatus {
  messageId: string;
  status: Message['status'];
  timestamp: Date;
}

export interface EmojiData {
  emoji: string;
  names: string[];
  id: string;
  keywords: string[];
  native: string;
  shortcodes: string;
  unified: string;
}

export interface SearchResult {
  type: 'chat' | 'message' | 'user';
  item: Chat | Message | User;
  relevance: number;
}
