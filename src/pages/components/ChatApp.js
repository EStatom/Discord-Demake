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
  //useState: this is a piece of data I want to remember and update as the user interacts with the app
//
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
      onSearch(value);  
    }    
  };
// onSearch(value): If onSearch exists, it gets called with the latest search term (value). 


  return (
    <div className="chat-header">
      
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
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) { 
      // highlight: This is the search term the user has entered (the text we want to highlight in the message)
      // highlight.trim() removes any spaces before or after the search term.
      return text;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi')); 
    // This line splits the original message (text) into parts wherever the search term (highlight) appears
    //new RegExp is a regular expression that helps find the search term in the message.
    {/*
      The g flag means "global," which tells the regular expression to find all occurrences of the search term in the text, not just the first one.
Without the g flag, the regular expression would stop after finding the first match.

The i flag : it is  meaning it will match the term regardless of whether it is in uppercase or lowercase. 
      */}
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
      ) : (
        part
      )
    );
   // style={{ backgroundColor: 'yellow' }}: This sets the background color of the matching text to yellow, making it stand out.
    // {part}: This is the text that matched the search term, displayed inside the highlighted span
    // index: This is the position of the current part in the array
    // part.toLowerCase(): Converts the current section of the text (the part) to lowercase.
    //style={{ backgroundColor: 'yellow' }}: The matching part will have a yellow background.
  };

  return (
    <div className="chat-messages">
      {messages
        .filter((message) =>
          message.content && message.content.toLowerCase().includes(searchTerm.toLowerCase()) // Add check for message.content
        )        
        .map((message) => (
          <div key={message.id} className="message-item">
            <div className="message-header">
              <span className="message-sender">{message.sender}</span>
              <span className="message-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="message-content">
              <p>{highlightText(message.content, searchTerm)}</p> {/* Highlight the search term in message content */}
              {message.fileURL && (
                <a href={message.fileURL} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              )}
            </div>
            <div className="message-actions">
              <button
                onClick={() => onEditMessage(message.id, prompt('Edit message:', message.content))}
              >
                Edit
              </button>
              <button onClick={() => onDeleteMessage(message.id)}>Delete</button>
            </div>
          </div>
        ))}
    </div>
  );
{/*
  messages.filter(): This function goes through each message and keeps only the ones that match the search term.
message.content: This check ensures that the message has content (some messages might not have content, so this avoids errors).


message.content.toLowerCase().includes(searchTerm.toLowerCase()):

  This converts both the message content and the search term to lowercase to make the search case-insensitive.
.includes() checks if the message content contains the search term.
  
.map(): This function goes through the filtered messages and displays each one.
key={message.id}: This provides a unique identifier for each message, which React uses to efficiently manage rendering.

  */}

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
      console.log('Uploading file:', file.name); // 
      fileURL = await uploadFileToFirebase(file); // to upload the file to Firebase
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
    if (e.key === 'Enter') { //e.key === 'Enter': This checks if the key that was pressed is the "Enter" key.
      sendMessage();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Add emoji to message
    console.log('Emoji added to message:', emojiObject.emoji); // Log the emoji added
  };

  //prevMessage is the current message content before adding the emoji.
  //prevMessage + emojiObject.emoji concatenates the emoji to the existing message.

  const handleFileChange = (e) => {  
     // Append the selected emoji to the message
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
            //onChange={(e) => setMessage(e.target.value)}: Whenever the user types something, this updates the message state with the new value (e.target.value is what the user typed).
          onKeyDown={handleKeyPress}
           //onKeyDown={handleKeyPress}: Detects when the user presses a key. In this case, it listens for the Enter key to send the message when pressed.

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
         // showEmojiPicker && (...): Displays the emoji picker only when the state showEmojiPicker is true.
        //showEmojiPicker is true, If the user has clicked the smiley button, this condition will be true and the emoji picker will appear.


      )}
    </div>
  );
};



// Main Chat App Component
const ChatApp = ({ serverDetails, selectedChannelId, username }) => {
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
          username={username}
        />
      </div>
    </div>
  );
};


export default ChatApp;