import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Menu, Hash, Search, Smile, Send } from 'lucide-react';
import './../styles/ChatApp.css';

// Chat Header Component
const ChatHeader = ({ name, serverId, type }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    console.log('Searching for:', e.target.value);
  };

  return (
    <div className="chat-header">
      <div className="header-left">
        <Menu className="icon" />
        {type === "channel" && <Hash className="icon" />}
        <span className="channel-name"># {name}</span>
      </div>
      <div className="header-search">
        <Search className="icon" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="server-info">Server: {serverId}</div>
    </div>
  );
};

// Chat Messages Component
const ChatMessages = () => {
  const messages = [
    { sender: 'User1', content: 'Hello!', timestamp: '10:45 AM' },
    { sender: 'User2', content: 'Hi there!', timestamp: '10:46 AM' },
    { sender: 'User1', content: 'How are you?', timestamp: '10:47 AM' },
  ];

  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <Message
          key={index}
          sender={msg.sender}
          content={msg.content}
          timestamp={msg.timestamp}
        />
      ))}
    </div>
  );
};

// Individual Message Component
const Message = ({ sender, content, timestamp }) => {
  return (
    <div className="message">
      <strong>{sender}</strong>
      <p>{content}</p>
      <span>{timestamp}</span>
    </div>
  );
};

// Chat Input Component
const ChatInput = () => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const sendMessage = () => {
    if (message.trim() !== '') {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <div className="chat-input">
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-field"
        />
        <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile className="icon" />
        </button>
        <button className="send-btn" onClick={sendMessage}>
          <Send className="icon" />
        </button>
      </div>
      {showEmojiPicker && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

// Main Chat App Component
const ChatApp = () => {
  return (
    <div className="chat-app">
      <ChatHeader name="server name" serverId="123" type="channel" />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatApp;
