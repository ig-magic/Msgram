import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Search,
  Info,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface ChatWindowProps {
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ className }) => {
  const { state, sendMessage, startTyping, stopTyping } = useApp();
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const activeChat = state.activeChat ? state.chats[state.activeChat] : null;
  const messages = state.activeChat ? state.messages[state.activeChat] || [] : [];

  const getChatDisplayInfo = () => {
    if (!activeChat) return null;
    
    if (activeChat.type === 'direct') {
      const otherParticipant = activeChat.participants.find(id => id !== user?.id);
      const otherUser = otherParticipant ? state.users[otherParticipant] : null;
      
      return {
        name: otherUser?.displayName || activeChat.name,
        avatar: otherUser?.avatar,
        isOnline: otherUser?.isOnline,
        lastSeen: otherUser?.lastSeen,
        username: otherUser?.username
      };
    }
    
    return {
      name: activeChat.name,
      avatar: activeChat.avatar,
      isOnline: false,
      lastSeen: undefined,
      username: undefined
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isTyping && activeChat) {
      startTyping(activeChat.id);
      const timer = setTimeout(() => {
        setIsTyping(false);
        stopTyping(activeChat.id);
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        stopTyping(activeChat.id);
      };
    }
  }, [isTyping, activeChat, startTyping, stopTyping]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;
    
    sendMessage(activeChat.id, messageInput.trim());
    setMessageInput('');
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (value: string) => {
    setMessageInput(value);
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessageInput(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const renderMessageStatus = (message: Message) => {
    if (message.senderId !== user?.id) return null;
    
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isOwn = message.senderId === user?.id;
    const sender = state.users[message.senderId];
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isOwn && (!prevMessage || prevMessage.senderId !== message.senderId);
    const showSender = !isOwn && activeChat?.type === 'group' && showAvatar;

    return (
      <div
        key={message.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1 group`}
      >
        <div className={`flex max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          {showAvatar && (
            <Avatar className="w-8 h-8 mr-2">
              <AvatarImage src={sender?.avatar} />
              <AvatarFallback className="bg-gray-500 text-white text-xs">
                {sender?.displayName?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`${!isOwn && !showAvatar ? 'ml-10' : ''}`}>
            {showSender && (
              <div className="text-xs text-gray-600 mb-1 px-3">
                {sender?.displayName}
              </div>
            )}
            
            <div
              className={`px-4 py-2 rounded-2xl ${
                isOwn
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}
            >
              <div className="break-words">{message.content}</div>
              
              <div className={`flex items-center justify-end mt-1 space-x-1 ${
                isOwn ? 'text-blue-100' : 'text-gray-500'
              }`}>
                <span className="text-xs">
                  {format(new Date(message.timestamp), 'HH:mm')}
                </span>
                {renderMessageStatus(message)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDateSeparator = (date: Date) => {
    let dateText = format(date, 'MMMM d, yyyy');
    
    if (isToday(date)) {
      dateText = 'Today';
    } else if (isYesterday(date)) {
      dateText = 'Yesterday';
    }
    
    return (
      <div className="flex items-center justify-center my-4">
        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
          {dateText}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    const groupedMessages: { date: string; messages: Message[] }[] = [];
    
    messages.forEach(message => {
      const dateKey = format(new Date(message.timestamp), 'yyyy-MM-dd');
      const existingGroup = groupedMessages.find(group => group.date === dateKey);
      
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groupedMessages.push({ date: dateKey, messages: [message] });
      }
    });
    
    return groupedMessages.map(group => (
      <div key={group.date}>
        {renderDateSeparator(new Date(group.date))}
        {group.messages.map((message, index) => renderMessage(message, index))}
      </div>
    ));
  };

  const displayInfo = getChatDisplayInfo();

  if (!activeChat || !displayInfo) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Send className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Msgram</h3>
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  const typingUsers = activeChat.isTyping?.filter(id => id !== user?.id) || [];

  return (
    <div className={`flex flex-col bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={displayInfo.avatar} />
              <AvatarFallback className="bg-blue-500 text-white">
                {displayInfo.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {displayInfo.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          
          <div>
            <h2 className="font-semibold text-gray-900">{displayInfo.name}</h2>
            <p className="text-sm text-gray-500">
              {displayInfo.isOnline ? (
                'online'
              ) : displayInfo.lastSeen ? (
                `last seen ${formatDistanceToNow(new Date(displayInfo.lastSeen), { addSuffix: true })}`
              ) : (
                'offline'
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Info className="w-4 h-4 mr-2" />
                Chat Info
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Search className="w-4 h-4 mr-2" />
                Search Messages
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {renderMessages()}
          
          {typingUsers.length > 0 && (
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span>
                {typingUsers.map(id => state.users[id]?.displayName).join(', ')} 
                {typingUsers.length === 1 ? ' is' : ' are'} typing...
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={messageInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Write a message..."
              className="pr-10"
            />
            
            <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 w-auto">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={350}
                  height={400}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
