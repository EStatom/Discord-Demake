import React, { useState } from 'react';
import { useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { listenForMessages, editMessageInFirebase, deleteMessageFromFirebase } from '../../firebase';
import { sendMessageToFirebase, uploadFileToFirebase } from '../../firebase';

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
    <div className="flex items-center justify-between p-4 bg-gray-900 text-white border-b border-gray-700">
      {/*className="flex items-center justify-between": This applies CSS classes from Tailwind CSS. It makes the content inside the div flexible (arranged in a row), aligns the items vertically in the center (items-center), and spaces them out evenly (justify-between)*/}
      {/*p-4: Adds padding around the content*/}
      {/*bg-gray-900 text-white: The background color is dark gray, and the text color is white.*/}
      {/*border-b border-gray-700: Adds a bottom border in a slightly lighter gray.*/}
      <div className="flex items-center space-x-2">
        <Menu className="w-5 h-5" />
                 {/*<Menu className="w-5 h-5" />: This renders a menu icon with width and height of 5 units. This could represent options/settings.*/}

        {type === "channel" && <Hash className="w-5 h-5" />}
                   {/*type === "channel" && (<Hash className="w-5 h-5" />)}: This checks if the type prop is "channel". If it is, it displays a # icon (common for channels).*/}
        <span className="font-semibold"># {name}</span>
                {/*This displays the name of the channel or direct message */}

      </div>
      <div className="flex items-center bg-gray-700 rounded-lg p-2 space-x-2 w-[40%]">
        <Search className="w-5 h-5 text-gray-400" />
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

          className="bg-transparent text-white border-none outline-none w-full"
        />
      </div>
                  {/*className="bg-transparent text-white border-none outline-none w-full": This removes the background and borders for the input, makes the text white, and ensures the input field takes up the full width (w-full)*/}

      <div className="bg-gray-800 px-3 py-1 rounded-lg text-gray-300">
        Server: {serverId}
      </div>
    </div>
  );
};

// Chat Messages Component
const ChatMessages = ({ searchTerm }) => {
  const [messages, setMessages] = useState([]);
  


  useEffect(() => {
    const unsubscribe = listenForMessages((newMessages) => {
      console.log('New messages received:', newMessages); // Log new messages
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, []);

  const handleEditMessage = (id, content) => {
    const newContent = prompt('Edit your message:', content); // Prompt to edit the message
    if (newContent !== null && newContent.trim() !== "") {
      editMessageInFirebase(id, newContent);  // Update the message in Firebase
    }
  };

  const handleDeleteMessage = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessageFromFirebase(id);
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
   const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? 
      <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : 
      part
    );
  };

  return (
    <div className="p-4 flex-1 overflow-y-auto">
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
    </div>
  );
};


// Individual Message Component
const Message = ({ sender, timestamp, content, fileURL, onDelete, onEdit }) => {
  return (
    <div className="flex items-start space-x-3 p-4">
      <div className="bg-gray-700 p-2 rounded-lg text-white max-w-[75%]">
        <p className="font-bold">{sender}</p>
        <p>{content}</p>
        {fileURL && <a href={fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-400">Download File</a>}
        <span className="text-sm text-gray-400">{timestamp}</span>
        <div className="flex space-x-2 mt-2">
          <button onClick={onDelete} className="text-red-500 text-sm">Delete</button>
          <button onClick={onEdit} className="text-blue-500 text-sm">Edit</button>
        </div>
      </div>
    </div>
  );
};

// Chat Input Component
const ChatInput = () => {
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
      console.log('Sending file URL:', fileURL); // Debugging log for file URL
      await sendMessageToFirebase(message, fileURL); // Send message and fileURL to Firebase
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
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      <div className="flex items-center space-x-2 w-full bg-gray-700 p-2">
        <input
          type="text"
          placeholder="Type your message here..."
          className="w-full bg-transparent text-white border-none outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="p-1 text-white" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile className="w-5 h-5" />
        </button>
        <label className="p-1 text-white cursor-pointer">
          <Plus className="w-5 h-5" />
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
        <button className="p-1 text-white" onClick={sendMessage}>
          <Send className="w-5 h-5" />
        </button>
      </div>
      {showEmojiPicker && (
        <div className="absolute bottom-14 right-0">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

// Main Chat App Component
const ChatApp = ({ serverDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle search input
  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log("Search term:", term); // Debugging log
  };

  return (
    <div className="chat-app">
      <ChatHeader 
        name={serverDetails ? serverDetails.name : "Invalid Server Name"}
        serverId={serverDetails ? serverDetails.description : ""}
        type="channel"
        onSearch={handleSearch}  // Pass the handleSearch function here
      />
      <ChatMessages searchTerm={searchTerm} />
      <div className="mt-auto w-full">
        <ChatInput />
      </div>
    </div>
  );
};


export default ChatApp;