import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Chat, User } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Search,
  Menu,
  MessageCircle,
  Settings,
  Moon,
  Sun,
  LogOut,
  UserPlus,
  Users,
  Pin,
  Archive,
  Check,
  CheckCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { state, dispatch, createChat, markAsRead } = useApp();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState('');

  const filteredChats = useMemo(() => {
    const chats = Object.values(state.chats).filter(chat =>
      chat.participants.includes(user?.id || '')
    );

    if (!searchQuery.trim()) {
      return chats.sort((a, b) => {
        // Pinned chats first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Then by last message time
        const aTime = a.lastMessage?.timestamp || a.updatedAt;
        const bTime = b.lastMessage?.timestamp || b.updatedAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
    }

    const query = searchQuery.toLowerCase();
    return chats.filter(chat => {
      const chatName = chat.name.toLowerCase();
      const participants = chat.participants
        .map(id => state.users[id])
        .filter(Boolean)
        .some(user => 
          user.displayName.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
        );
      
      return chatName.includes(query) || participants;
    });
  }, [state.chats, state.users, user?.id, searchQuery]);

  const getChatDisplayInfo = (chat: Chat) => {
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(id => id !== user?.id);
      const otherUser = otherParticipant ? state.users[otherParticipant] : null;
      
      return {
        name: otherUser?.displayName || chat.name,
        avatar: otherUser?.avatar,
        isOnline: otherUser?.isOnline,
        lastSeen: otherUser?.lastSeen
      };
    }
    
    return {
      name: chat.name,
      avatar: chat.avatar,
      isOnline: false,
      lastSeen: undefined
    };
  };

  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const message = chat.lastMessage;
    const sender = state.users[message.senderId];
    const isOwn = message.senderId === user?.id;
    
    let content = message.content;
    if (content.length > 30) {
      content = content.substring(0, 30) + '...';
    }
    
    if (chat.type === 'group' && !isOwn) {
      return `${sender?.displayName || 'Unknown'}: ${content}`;
    }
    
    return content;
  };

  const getMessageStatus = (chat: Chat) => {
    if (!chat.lastMessage || chat.lastMessage.senderId !== user?.id) return null;
    
    const status = chat.lastMessage.status;
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleChatSelect = (chatId: string) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chatId });
    markAsRead(chatId);
  };

  const handleNewChat = () => {
    if (!newChatUsername.trim()) return;
    
    const targetUser = Object.values(state.users).find(u => 
      u.username.toLowerCase() === newChatUsername.toLowerCase()
    );
    
    if (!targetUser) {
      alert('User not found');
      return;
    }
    
    if (targetUser.id === user?.id) {
      alert('Cannot create chat with yourself');
      return;
    }
    
    // Check if chat already exists
    const existingChat = Object.values(state.chats).find(chat =>
      chat.type === 'direct' && 
      chat.participants.includes(targetUser.id) && 
      chat.participants.includes(user?.id || '')
    );
    
    if (existingChat) {
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: existingChat.id });
    } else {
      const chatId = createChat([targetUser.id]);
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: chatId });
    }
    
    setNewChatUsername('');
    setShowNewChatDialog(false);
  };

  const toggleTheme = () => {
    dispatch({ 
      type: 'SET_THEME', 
      payload: state.theme === 'light' ? 'dark' : 'light' 
    });
  };

  return (
    <div className={`flex flex-col bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={toggleTheme}>
                {state.theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                {state.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="w-4 h-4 mr-2" />
                Archived Chats
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <h1 className="text-xl font-semibold text-gray-900">Msgram</h1>
        </div>
        
        <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <MessageCircle className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Chat</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  placeholder="Enter username"
                  value={newChatUsername}
                  onChange={(e) => setNewChatUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNewChat()}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewChatDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewChat} disabled={!newChatUsername.trim()}>
                  Start Chat
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredChats.map((chat) => {
            const displayInfo = getChatDisplayInfo(chat);
            const isActive = state.activeChat === chat.id;
            
            return (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={displayInfo.avatar} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {displayInfo.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {displayInfo.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 truncate">
                        {displayInfo.name}
                      </p>
                      {chat.isPinned && <Pin className="w-4 h-4 text-gray-400" />}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {getMessageStatus(chat)}
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: false })}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {getLastMessagePreview(chat)}
                    </p>
                    
                    {chat.unreadCount > 0 && (
                      <Badge variant="default" className="bg-blue-500 text-xs px-2 py-1">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredChats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
