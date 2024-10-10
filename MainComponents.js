// note that the work is a stack page, so we need to replace it by active work

import React, { useState } from 'react';
import ChatHeader from './chat-header';
import ChatInput from './chat-input';
import ChatMessages from './chatMessages';

const MainComponents = () => {
  const [searchTerm, setSearchTerm] = useState(''); 

  return (
    <div className="bg-[#79899e] w-full h-full flex flex-col min-h-screen">
      <ChatHeader 
        name="Some Channel Name" 
        serverId="123" 
        type="channel" 
        onSearch={setSearchTerm} // Pass the setSearchTerm function to update the search term
      />
      <ChatMessages searchTerm={searchTerm} /> {/* Pass searchTerm to ChatMessages */}
      <div className="mt-auto w-full">
        <ChatInput />
      </div>
    </div>
  );
};

export default MainComponents;


{/*
mt-auto: This pushes the chat input box to the bottom of the screen. It ensures that no matter how many messages there are, the input field will always be at the bottom.
w-full: Makes the chat input box take the full width of the screen.

/api/socket/messages is an API endpoint used by the chat app to send and receive messages.
/channelId: A unique identifier for the chat channel 
/serverId: A unique identifier for the server

*/}