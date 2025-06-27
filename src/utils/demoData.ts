import { v4 as uuidv4 } from 'uuid';
import { Chat, Message } from '../types';

export const createDemoChatsAndMessages = (currentUserId: string) => {
  const now = new Date();
  
  // Demo users (already created in App.tsx)
  const demoUserIds = ['demo-user-1', 'demo-user-2', 'demo-user-3'];
  
  // Create demo chats
  const demoChats: Record<string, Chat> = {};
  const demoMessages: Record<string, Message[]> = {};
  
  // Chat with Alice
  const aliceChatId = uuidv4();
  demoChats[aliceChatId] = {
    id: aliceChatId,
    name: 'Alice Johnson',
    type: 'direct',
    participants: [currentUserId, 'demo-user-1'],
    unreadCount: 2,
    createdAt: new Date(now.getTime() - 86400000), // 1 day ago
    updatedAt: new Date(now.getTime() - 1800000), // 30 minutes ago
    isPinned: true,
    isMuted: false
  };
  
  // Messages with Alice
  demoMessages[aliceChatId] = [
    {
      id: uuidv4(),
      senderId: 'demo-user-1',
      chatId: aliceChatId,
      content: 'Hey! How are you doing? 👋',
      timestamp: new Date(now.getTime() - 3600000), // 1 hour ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: currentUserId,
      chatId: aliceChatId,
      content: 'Hi Alice! I\'m doing great, thanks for asking. How about you?',
      timestamp: new Date(now.getTime() - 3300000), // 55 minutes ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: 'demo-user-1',
      chatId: aliceChatId,
      content: 'I\'m good too! Just working on some new projects. Are you still coding that React app?',
      timestamp: new Date(now.getTime() - 3000000), // 50 minutes ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: currentUserId,
      chatId: aliceChatId,
      content: 'Yes! Actually, I\'m building a Telegram clone now. It\'s pretty exciting! 🚀',
      timestamp: new Date(now.getTime() - 2700000), // 45 minutes ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: 'demo-user-1',
      chatId: aliceChatId,
      content: 'That sounds amazing! Can\'t wait to try it out 😍',
      timestamp: new Date(now.getTime() - 1800000), // 30 minutes ago
      type: 'text',
      status: 'delivered'
    },
    {
      id: uuidv4(),
      senderId: 'demo-user-1',
      chatId: aliceChatId,
      content: 'Let me know when you\'re ready for beta testing!',
      timestamp: new Date(now.getTime() - 1740000), // 29 minutes ago
      type: 'text',
      status: 'delivered'
    }
  ];
  
  // Chat with Bob
  const bobChatId = uuidv4();
  demoChats[bobChatId] = {
    id: bobChatId,
    name: 'Bob Smith',
    type: 'direct',
    participants: [currentUserId, 'demo-user-2'],
    unreadCount: 0,
    createdAt: new Date(now.getTime() - 172800000), // 2 days ago
    updatedAt: new Date(now.getTime() - 900000), // 15 minutes ago
    isPinned: false,
    isMuted: false
  };
  
  // Messages with Bob
  demoMessages[bobChatId] = [
    {
      id: uuidv4(),
      senderId: 'demo-user-2',
      chatId: bobChatId,
      content: 'Good morning! ☀️',
      timestamp: new Date(now.getTime() - 21600000), // 6 hours ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: currentUserId,
      chatId: bobChatId,
      content: 'Good morning Bob! How\'s your design work going?',
      timestamp: new Date(now.getTime() - 21300000), // 5 hours 55 minutes ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: 'demo-user-2',
      chatId: bobChatId,
      content: 'Pretty well! I\'m working on a new UI kit. Want to see some previews?',
      timestamp: new Date(now.getTime() - 21000000), // 5 hours 50 minutes ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: currentUserId,
      chatId: bobChatId,
      content: 'Absolutely! I\'d love to see what you\'ve been working on 🎨',
      timestamp: new Date(now.getTime() - 900000), // 15 minutes ago
      type: 'text',
      status: 'read'
    }
  ];
  
  // Chat with Charlie
  const charlieChatId = uuidv4();
  demoChats[charlieChatId] = {
    id: charlieChatId,
    name: 'Charlie Wilson',
    type: 'direct',
    participants: [currentUserId, 'demo-user-3'],
    unreadCount: 1,
    createdAt: new Date(now.getTime() - 259200000), // 3 days ago
    updatedAt: new Date(now.getTime() - 600000), // 10 minutes ago
    isPinned: false,
    isMuted: false
  };
  
  // Messages with Charlie
  demoMessages[charlieChatId] = [
    {
      id: uuidv4(),
      senderId: currentUserId,
      chatId: charlieChatId,
      content: 'Hey Charlie! How\'s the music production going?',
      timestamp: new Date(now.getTime() - 7200000), // 2 hours ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: 'demo-user-3',
      chatId: charlieChatId,
      content: 'It\'s going amazing! Just finished a new track. Want to hear it? 🎵',
      timestamp: new Date(now.getTime() - 600000), // 10 minutes ago
      type: 'text',
      status: 'sent'
    }
  ];
  
  // Group chat
  const groupChatId = uuidv4();
  demoChats[groupChatId] = {
    id: groupChatId,
    name: 'Dev Team 👨‍💻',
    type: 'group',
    participants: [currentUserId, 'demo-user-1', 'demo-user-2', 'demo-user-3'],
    unreadCount: 5,
    createdAt: new Date(now.getTime() - 604800000), // 1 week ago
    updatedAt: new Date(now.getTime() - 300000), // 5 minutes ago
    isPinned: false,
    isMuted: false,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Dev Team',
    description: 'Our awesome development team group chat!'
  };
  
  // Group messages
  demoMessages[groupChatId] = [
    {
      id: uuidv4(),
      senderId: 'demo-user-1',
      chatId: groupChatId,
      content: 'Morning everyone! Ready for another productive day? ☕',
      timestamp: new Date(now.getTime() - 28800000), // 8 hours ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: 'demo-user-2',
      chatId: groupChatId,
      content: 'Absolutely! I\'ve got some new designs to show you all 🎨',
      timestamp: new Date(now.getTime() - 28500000), // 7 hours 55 minutes ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: 'demo-user-3',
      chatId: groupChatId,
      content: 'I\'ll have the sound effects ready by noon 🔊',
      timestamp: new Date(now.getTime() - 28200000), // 7 hours 50 minutes ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: currentUserId,
      chatId: groupChatId,
      content: 'Great! I\'ll be pushing the latest code changes shortly. The messaging feature is almost complete! 🚀',
      timestamp: new Date(now.getTime() - 27900000), // 7 hours 45 minutes ago
      type: 'text',
      status: 'read'
    },
    {
      id: uuidv4(),
      senderId: 'demo-user-1',
      chatId: groupChatId,
      content: 'Awesome work everyone! This project is coming together nicely 👏',
      timestamp: new Date(now.getTime() - 300000), // 5 minutes ago
      type: 'text',
      status: 'delivered'
    }
  ];
  
  // Update last messages
  demoChats[aliceChatId].lastMessage = demoMessages[aliceChatId][demoMessages[aliceChatId].length - 1];
  demoChats[bobChatId].lastMessage = demoMessages[bobChatId][demoMessages[bobChatId].length - 1];
  demoChats[charlieChatId].lastMessage = demoMessages[charlieChatId][demoMessages[charlieChatId].length - 1];
  demoChats[groupChatId].lastMessage = demoMessages[groupChatId][demoMessages[groupChatId].length - 1];
  
  return { demoChats, demoMessages };
};
