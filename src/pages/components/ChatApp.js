import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { sendMessageToFirebase, uploadFileToFirebase } from './../../firebaseService';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

import { Menu, Hash, Search, Smile, Plus, Send } from 'lucide-react';
import './../styles/ChatApp.css';

// HighlightedText Component
const HighlightedText = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
// highlight: This is the search term the user has entered (the text we want to highlight in the message)
      // highlight.trim() removes any spaces before or after the search term.
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
        ) : (
          part
        )
      )}
    </span>
  );


   // This line splits the original message (text) into parts wherever the search term (highlight) appears
    //new RegExp is a regular expression that helps find the search term in the message.
    {/*
      The g flag means "global," which tells the regular expression to find all occurrences of the search term in the text, not just the first one.
Without the g flag, the regular expression would stop after finding the first match.

The i flag : it is  meaning it will match the term regardless of whether it is in uppercase or lowercase. 
      */}
        // style={{ backgroundColor: 'yellow' }}: This sets the background color of the matching text to yellow, making it stand out.
    // {part}: This is the text that matched the search term, displayed inside the highlighted span
    // index: This is the position of the current part in the array
    // part.toLowerCase(): Converts the current section of the text (the part) to lowercase.
    //style={{ backgroundColor: 'yellow' }}: The matching part will have a yellow background.
};



// Chat Header Component
const ChatHeader = ({ name, serverId, type, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
// searchTerm: it is to store what the user has typed into the search bar.
// setSearchTerm: This is a function that updates searchTerm. Whenever the user types something new, setSearchTerm will update it.
  //useState: this is a piece of data I want to remember and update as the user interacts with the app// setSearchTerm: This is a function that updates searchTerm. Whenever the user types something new, setSearchTerm will update it.
  const handleSearch = (e) => { 
    // Whenever the user types in the search box, it will update.
   
      {/*
        // handleSearch :
        1- Capture what the user has typed.
        2- Update the state (searchTerm) with the new text.
        3- If a search function (onSearch) has been provided, it triggers that function to perform the search.
        */}
    const value = e.target.value;
     // this part is updating the search term (the text in the search box) with whatever the user types.
     //e.target.value: it is the current text that the user has typed in the search box.

    setSearchTerm(value);   
    if (onSearch) {
      onSearch(value);  // Ensure onSearch is called correctly
    }    
  };
// onSearch(value): If onSearch exists, it gets called with the latest search term (value). 

  return (
    <div className="chat-header">
      
      <div className="header-left">
        

        {type === "channel" && <Hash className="w-5 h-5" />}
                   {/*type === "channel" && (<Hash className="w-5 h-5" />)}: This checks if the type prop is "channel". If it is, it displays a # icon (common for channels).*/}
        <span className="font-semibold"> {name}</span>
                {/*This displays the name of the channel or direct message */}

      </div>
      <div className="header-search">
        <Search className="search-icon" />
        
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
const ChatMessages = ({ messages, searchTerm, onEditMessage, onDeleteMessage, username, userId, userData }) => {
  const defaultProfilePictures = [
    'https://firebasestorage.googleapis.com/v0/b/discord-demake-ae307.appspot.com/o/test.jpg?alt=media&token=ea8cba9e-178d-4e81-8b1e-9d38e6d5e10b',
    'https://firebasestorage.googleapis.com/v0/b/discord-demake-ae307.appspot.com/o/images.jpg?alt=media&token=c3a74351-d27b-41a3-89ee-e2e4c180b77d',
    'https://firebasestorage.googleapis.com/v0/b/discord-demake-ae307.appspot.com/o/images%20(3).jpg?alt=media&token=784c870b-5cb4-4007-ae8f-c5af1e411af5',
    'https://firebasestorage.googleapis.com/v0/b/discord-demake-ae307.appspot.com/o/images%20(2).jpg?alt=media&token=5c299a63-544f-4de0-9ca1-b8b2bc2a700d',
    'https://firebasestorage.googleapis.com/v0/b/discord-demake-ae307.appspot.com/o/images%20(1).jpg?alt=media&token=88e2673b-a6b8-4fce-9c84-7775d025984b',
    'https://firebasestorage.googleapis.com/v0/b/discord-demake-ae307.appspot.com/o/download.jpg?alt=media&token=ca4055db-9f75-42a3-a914-d822ae5ddc10',
    'https://firebasestorage.googleapis.com/v0/b/discord-demake-ae307.appspot.com/o/download%20(2).jpg?alt=media&token=fe303e86-3ce9-4d40-ae8e-048e2b2311b4',
    'https://firebasestorage.googleapis.com/v0/b/discord-demake-ae307.appspot.com/o/download%20(1).jpg?alt=media&token=2519aed4-036f-45d3-8113-f1cf02af6604'
  ];

  // Function to get a random profile picture URL
  const getRandomProfilePicture = () => {
    const randomIndex = Math.floor(Math.random() * defaultProfilePictures.length);
    return defaultProfilePictures[randomIndex];
  };
 
 
  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <div key={message.id} className="message-item">
          <div className="message-header">
            <img 
              src={`${userData?.profilePicture || getRandomProfilePicture()}?t=${new Date().getTime()}`}
alt="User Avatar" 
              className="message-avatar" 
            />
            <span className="message-sender">{message.sender}</span>
            <span className="message-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="message-content">
            <p>
              <HighlightedText text={message.content || ''} highlight={searchTerm} />
            </p>
            {message.fileURL && <a href={message.fileURL} target="_blank" rel="noopener noreferrer">📁 Download File</a>}
          </div>
          {/* Show Edit and Delete buttons only if the current user is the sender */}
          {message.sender === username && (
            <div className="message-actions">
              <button onClick={() => onEditMessage(message.id, prompt('Edit message:', message.content || ''))}>Edit</button>
              <button onClick={() => onDeleteMessage(message.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};




// Individual Message Component
const Message = ({ sender, timestamp, content, fileURL, onDelete, onEdit }) => {
  return (
    <div className="message">
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
    </div>
  );
{/*
  <p className="message-sender">{sender}</p>
<p>{content}</p>
Displays the sender’s name and the message content.

If the message has an attached file (fileURL), it shows a link to download the file. This link opens in a new tab.
###########################################
  <span className="message-timestamp">{timestamp}</span>
  Displays the time the message was sent.
##########################################
<button onClick={onDelete} className="text-red-500">Delete</button>
<button onClick={onEdit} className="text-blue-500">Edit</button>

// These buttons allow the user to delete or edit the message using the provided onDelete and onEdit functions, which are passed as props.
  */}



};

// Chat Input Component
const ChatInput = ({ selectedServerId, selectedChannelId, username }) => {
  const [message, setMessage] = useState('');
// message: This is the current value of the chat input (what the user has typed).
  // setMessage: This is the function that you call whenever you want to change or update the value of message.
  //useState('') initializes the message state as an empty string, and setMessage is the function to update it as the user types.
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
 // showEmojiPicker: This is a boolean (either true or false) that tells whether the emoji picker is currently shown (true) or hidden (false).
  //setShowEmojiPicker: A function to update the showEmojiPicker state.
  const [file, setFile] = useState(null);
  
  const sendMessage = async () => {
    let fileURL = null;

    if (file) {
      console.log('Uploading file:', file.name); 
      fileURL = await uploadFileToFirebase(file); // to upload the file to Firebase
      console.log('File uploaded, URL:', fileURL); // Log the uploaded file URL
      setFile(null); // to clear the file after upload
    }

    if (message.trim() !== '' || fileURL) {
      console.log('Sending message with content:', message);
      console.log('Sending file URL:', fileURL, selectedServerId, selectedChannelId); 
      await sendMessageToFirebase(message, fileURL, selectedServerId, selectedChannelId, username); // to send message and fileURL to Firebase
      setMessage(''); // to clear message after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      //e.key === 'Enter': This checks if the key that was pressed is the "Enter" key.
      sendMessage();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // to add emoji to message
    console.log('Emoji added to message:', emojiObject.emoji); 
  };
//prevMessage is the current message content before adding the emoji.
  //prevMessage + emojiObject.emoji concatenates the emoji to the existing message.


  const handleFileChange = (e) => {
         // Append the selected emoji to the message

    setFile(e.target.files[0]);
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
           //onChange={(e) => setMessage(e.target.value)}: Whenever the user types something, this updates the message state with the new value (e.target.value is what the user typed).

          onKeyDown={handleKeyPress}
         //onKeyDown={handleKeyPress}: Detects when the user presses a key. In this case, it listens for the Enter key to send the message when pressed.

        />
        <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile className="emoji-icon" />
        </button>
        <label className="p-1 text-white cursor-pointer">
          
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
         // showEmojiPicker && (...): Displays the emoji picker only when the state showEmojiPicker is true.
        //showEmojiPicker is true, If the user has clicked the smiley button, this condition will be true and the emoji picker will appear.
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
        username={userData?.username}
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