import React, { useState } from 'react';
import { useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { sendMessageToFirebase, uploadFileToFirebase } from './../../firebaseService';
import { db } from '../../firebase';

import { Menu, Hash, Search, Smile, Plus, Send } from 'lucide-react';
import './../styles/ChatApp.css';

// Chat Header Component
const ChatHeader = ({ name, serverId, type, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
// searchTerm: it is to store what the user has typed into the search bar.
// setSearchTerm: This is a function that updates searchTerm. Whenever the user types something new, setSearchTerm will update it.
  const handleSearch = (e) => { // Whenever the user types in the search box, it will update.
    const value = e.target.value; // this part is updating the search term (the text in the search box) with whatever the user types.
    setSearchTerm(value);   
    if (onSearch) {
      onSearch(value);  // Ensure onSearch is called correctly
    }    
  };

  return (
    <div className="chat-header">
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
        <input
          type="text"
          placeholder="Search..."  //placeholder="Search...": This is the placeholder text that appears when the input is empty.
          value={searchTerm}
          onChange={handleSearch}
                    //onChange={handleSearch}: Whenever the user types something, the handleSearch function is called to update the searchTerm value.

          className="search-input"
        />
      </div>
                  {/*className="bg-transparent text-white border-none outline-none w-full": This removes the background and borders for the input, makes the text white, and ensures the input field takes up the full width (w-full)*/}

      <div className="server-info">
        Server: {serverId}
      </div>
    </div>
  );
};

// Chat Messages Component
const ChatMessages = ({ messages, searchTerm, onEditMessage, onDeleteMessage }) => {
  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <div key={message.id} className="message-item">
          <div className="message-header">
            <span className="message-sender">{message.sender}</span>
            <span className="message-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="message-content">
            <p>{message.content}</p>
            {message.fileURL && <a href={message.fileURL} target="_blank" rel="noopener noreferrer">View File</a>}
          </div>
          <div className="message-actions">
            <button onClick={() => onEditMessage(message.id, prompt('Edit message:', message.content))}>Edit</button>
            <button onClick={() => onDeleteMessage(message.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};


// Chat Input Component
const ChatInput = ({ selectedServerId, selectedChannelId, username }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);
  
  const sendMessage = async () => {
    let fileURL = null;

    if (file) {
      console.log('Uploading file:', file.name); // Debugging log for file upload
      fileURL = await uploadFileToFirebase(file); // Upload the file to Firebase
      console.log('File uploaded, URL:', fileURL); // Log the uploaded file URL
      setFile(null); // Clear the file after upload
    }

    if (message.trim() !== '' || fileURL) {
      console.log('Sending message with content:', message); // Debugging log for message content
      console.log('Sending file URL:', fileURL, selectedServerId, selectedChannelId); // Debugging log for file URL
      await sendMessageToFirebase(message, fileURL, selectedServerId, selectedChannelId, username); // Send message and fileURL to Firebase
      setMessage(''); // Clear message after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Add emoji to message
    console.log('Emoji added to message:', emojiObject.emoji); // Log the emoji added
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store selected file
    console.log('File selected:', e.target.files[0]); // Log selected file
  };

  return (
    <div className="chat-input">
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message here..."
          className="w-full bg-transparent text-white border-none outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile className="emoji-icon" />
        </button>
        <label className="p-1 text-white cursor-pointer">
          <Plus className="plus-icon" />
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
        <button className="send-btn" onClick={sendMessage}>
          <Send className="send-icon" />
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
const ChatApp = ({ serverDetails, selectedChannelId, userData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedChannelId) {
      const q = query(
        collection(db, `servers/${serverDetails.id}/channels/${selectedChannelId}/messages`), 
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const channelMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(channelMessages);  
      });

      
      return () => unsubscribe();
    }
  }, [serverDetails, selectedChannelId]);

  const editMessage = async (messageId, newContent) => {
    const messageDocRef = doc(db, `servers/${serverDetails.id}/channels/${selectedChannelId}/messages`, messageId);
    await updateDoc(messageDocRef, { content: newContent });
    console.log(`Message ${messageId} edited successfully`);
  };

  // Function to delete a message
  const deleteMessage = async (messageId) => {
    const messageDocRef = doc(db, `servers/${serverDetails.id}/channels/${selectedChannelId}/messages`, messageId);
    await deleteDoc(messageDocRef);
    console.log(`Message ${messageId} deleted successfully`);
  };

  // Function to handle search input
  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log("Search term:", term);
  };

  return (
    <div className="chat-app">
      <ChatHeader 
        name={serverDetails ? serverDetails.name : "Invalid Server Name"}
        serverId={serverDetails ? serverDetails.description : ""}
        type="channel"
        onSearch={handleSearch}
      />
      <ChatMessages 
        messages={messages} 
        searchTerm={searchTerm} 
        onEditMessage={editMessage}   // Pass the edit handler
        onDeleteMessage={deleteMessage}  // Pass the delete handler
      />
      <div className="chat-input">
        <ChatInput 
          selectedServerId={serverDetails ? serverDetails.id : null} 
          selectedChannelId={selectedChannelId} 
          username={userData?.username}
        />
      </div>
    </div>
  );
};


export default ChatApp;