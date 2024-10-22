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
<<<<<<< Updated upstream
      <div className="header-left">
        <Menu className="icon" />
        {type === "channel" && <Hash className="icon" />}
        <span className="channel-name">{name}</span>
      </div>
      <div className="header-search">
        <Search className="icon" />
=======
      {/*className="flex items-center justify-between": This applies CSS classes from Tailwind CSS. It makes the content inside the div flexible (arranged in a row), aligns the items vertically in the center (items-center), and spaces them out evenly (justify-between)*/}
      {/*p-4: Adds padding around the content*/}
      {/*bg-gray-900 text-white: The background color is dark gray, and the text color is white.*/}
      {/*border-b border-gray-700: Adds a bottom border in a slightly lighter gray.*/}
      <div className="header-left">
        <Menu className="w-5 h-5" />
                 {/*<Menu className="w-5 h-5" />: This renders a menu icon with width and height of 5 units. This could represent options/settings.*/}

        {type === "channel" && <Hash className="w-5 h-5" />}
                   {/*type === "channel" && (<Hash className="w-5 h-5" />)}: This checks if the type prop is "channel". If it is, it displays a # icon (common for channels).*/}
        <span className="font-semibold"># {name}</span>
                {/*This displays the name of the channel or direct message */}

      </div>
      <div className="header-search">
        <Search className="search-icon" />
        {/*bg-gray-700: Sets a darker gray background for the search bar.*/}
               {/*rounded-lg: Adds rounded corners to the search bar.*/}
               {/* p-2: Adds padding around the search bar content.*/}
               {/*space-x-2: Adds space between the search icon and the input field.*/}
               {/*w-[40%]: Sets the width of the search bar to 40% of the available space in the header*/}
>>>>>>> Stashed changes
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
<<<<<<< Updated upstream
          className="search-input"
        />
      </div>
      <div className="server-info">Server Description: {serverId}</div>
=======
                    //onChange={handleSearch}: Whenever the user types something, the handleSearch function is called to update the searchTerm value.

          className="search-input"
        />
      </div>
                  {/*className="bg-transparent text-white border-none outline-none w-full": This removes the background and borders for the input, makes the text white, and ensures the input field takes up the full width (w-full)*/}

      <div className="server-info">
        Server: {serverId}
      </div>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      {messages.map((msg, index) => (
        <Message
          key={index}
          sender={msg.sender}
          content={msg.content}
          timestamp={msg.timestamp}
        />
      ))}
=======
      {messages
        .filter((msg) => msg.content.toLowerCase().includes(searchTerm.toLowerCase())) // Filter based on search term
        .map((msg, index) => (
          <Message
            key={index}
            sender={msg.sender}
            content={highlightText(msg.content, searchTerm)} // Highlight the search term
            timestamp={msg.timestamp}
            fileURL={msg.fileURL} // Pass fileURL if available
            onDelete={() => handleDeleteMessage(msg.id)} // Handle message delete
            onEdit={() => handleEditMessage(msg.id, msg.content)} // Handle message edit
          />
        ))}
>>>>>>> Stashed changes
    </div>
  );
};

// Individual Message Component
const Message = ({ sender, content, timestamp }) => {
  return (
    <div className="message">
<<<<<<< Updated upstream
      <strong>{sender}</strong>
      <p>{content}</p>
      <span>{timestamp}</span>
=======
      <div className="message">
        <p className="message-sender">{sender}</p>
        <p>{content}</p>
        {fileURL && <a href={fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-400">Download File</a>}
        <span className="message-timestamp">{timestamp}</span>
        <div className="flex space-x-2 mt-2">
          <button onClick={onDelete} className="text-red-500">Delete</button>
          <button onClick={onEdit} className="text-blue-500">Edit</button>
        </div>
      </div>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          <Smile className="icon" />
        </button>
        <button className="send-btn" onClick={sendMessage}>
          <Send className="icon" />
=======
          <Smile className="emoji-icon" />
        </button>
        <label className="p-1 text-white cursor-pointer">
          <Plus className="plus-icon" />
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
        <button className="send-btn" onClick={sendMessage}>
          <Send className="send-icon" />
>>>>>>> Stashed changes
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
const ChatApp = ({serverDetails}) => {
  return (
    <div className="chat-app">
<<<<<<< Updated upstream
      <ChatHeader name={serverDetails ? serverDetails.name : "Invalid Server Name"} serverId={serverDetails ? serverDetails.description : ""} type="channel" />
      <ChatMessages />
      <ChatInput />
=======
      <ChatHeader 
        name={serverDetails ? serverDetails.name : "Invalid Server Name"}
        serverId={serverDetails ? serverDetails.description : ""}
        type="channel"
        onSearch={handleSearch}  // Pass the handleSearch function here
      />
      <ChatMessages searchTerm={searchTerm} />
      <div className="chat-input">
        <ChatInput />
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default ChatApp;
