# Msgram - Telegram Clone

A complete, fully functional web-based messaging application that replicates Telegram's appearance and core features.

## 🚀 Features

### ✅ Authentication System
- User registration with username/password
- Login/logout functionality
- Session management with localStorage
- User profiles with avatars

### ✅ Real-time Messaging
- Send and receive messages instantly
- Message status indicators (sent, delivered, read)
- Typing indicators
- Message timestamps with smart formatting

### ✅ Chat Management
- Direct messaging between users
- Group chat functionality
- Search chats and users
- Pinned chats
- Unread message counters

### ✅ User Interface
- Exact Telegram-style design and layout
- Responsive design for all screen sizes
- Sidebar with chat list
- Modern message bubbles
- User avatars and online status indicators
- Dark/light theme support

### ✅ Emoji Support
- Comprehensive emoji picker
- Emoji rendering in messages
- Easy emoji insertion

### ✅ Advanced Features
- User discovery by username
- Message search functionality
- Settings panel
- Chat information
- Demo data for testing

## 🏃‍♂️ Quick Start

### Demo Users
The application comes pre-loaded with demo users for testing:

| Username | Password | Display Name |
|----------|----------|--------------|
| `alice` | `password123` | Alice Johnson |
| `bob` | `password123` | Bob Smith |
| `charlie` | `password123` | Charlie Wilson |

### Getting Started
1. **Visit the application**: Access the deployed Msgram app
2. **Sign Up**: Create a new account with your preferred username
3. **Or Sign In**: Use one of the demo accounts above
4. **Start Chatting**: 
   - Click the compose button to start a new chat
   - Enter a demo username (alice, bob, or charlie)
   - Start messaging!

### Demo Data
When you first log in, the application automatically creates:
- **3 direct chats** with demo users containing conversation history
- **1 group chat** with all demo users
- **Sample messages** with various timestamps and statuses
- **Unread message indicators** for testing

## 🛠️ Technical Features

### Built With
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **emoji-picker-react** for emoji functionality
- **date-fns** for date formatting
- **Vite** for build tooling

### Architecture
- **Context API** for state management
- **Local Storage** for data persistence
- **Component-based** architecture
- **Responsive design** with mobile support
- **Accessible UI** components

### Data Storage
- User authentication data
- Chat history and messages
- User preferences and settings
- All data persisted in browser localStorage

## 🎨 Design Highlights

### Visual Features
- **Telegram-identical UI**: Exact color scheme, typography, and layout
- **Message Bubbles**: Different styles for sent/received messages
- **Status Indicators**: Visual feedback for message delivery status
- **Typing Animation**: Real-time typing indicators
- **Online Status**: Green dots for active users
- **Smooth Animations**: Seamless transitions and interactions

### UX Features
- **Smart Date Formatting**: "Today", "Yesterday", or full dates
- **Message Grouping**: Consecutive messages from same sender
- **Keyboard Shortcuts**: Enter to send messages
- **Auto-scroll**: Automatic scrolling to latest messages
- **Search Functionality**: Find chats and messages quickly

## 🔧 Usage Instructions

### Starting a New Chat
1. Click the compose message icon in the sidebar header
2. Enter the username of who you want to chat with
3. Click "Start Chat" or press Enter
4. Begin messaging immediately

### Sending Messages
1. Type your message in the input field at the bottom
2. Use the emoji button to add emojis
3. Press Enter or click Send to send your message
4. Watch for delivery status indicators

### Group Features
- View group chats in the sidebar
- See all participants in group info
- Send messages to multiple users at once

### Settings & Preferences
- Toggle between light and dark themes
- Access chat settings and information
- View user profiles and status

## 🌟 Demo Scenarios

### Try These Features
1. **Multi-user Conversations**: Log in as different demo users to see real-time chat
2. **Message Status Testing**: Send messages and watch status changes
3. **Emoji Usage**: Add emojis to your messages using the picker
4. **Search Testing**: Use the search to find specific chats or messages
5. **Theme Switching**: Toggle between light and dark modes
6. **Responsive Design**: Test on different screen sizes

### Sample Conversations
The demo data includes realistic conversations about:
- Development projects and coding
- Design work and creative projects  
- Music production and collaboration
- Team coordination and planning

## 🚀 Deployment

The application is built as a static single-page application (SPA) and can be deployed to any web hosting service:

- **Built with Vite** for optimized production builds
- **No server required** - purely client-side application
- **CDN friendly** with optimized assets
- **Mobile responsive** for all devices

## 🔒 Security Note

This is a demo application designed for testing and demonstration purposes. In a production environment, you would want to:
- Use proper authentication with secure password hashing
- Implement server-side message storage
- Add proper data validation and sanitization
- Use HTTPS for all communications
- Implement rate limiting and abuse prevention

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

*Experience the power of modern web messaging with Msgram - your Telegram clone that works entirely in the browser!*
