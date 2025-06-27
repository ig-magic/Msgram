import React from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';

export const ChatLayout: React.FC = () => {
  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="w-80 flex-shrink-0" />
      
      {/* Main Chat Window */}
      <ChatWindow className="flex-1" />
    </div>
  );
};
