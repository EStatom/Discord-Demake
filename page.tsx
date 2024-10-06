// note that the work is a stack page, so we need to replace it by active work
// Currently, sender, timestamp, and content are static. 
// Later, we will manage them with a database (SQL) for dynamic handling.


import { ChatHeader } from '@/app/components/chat/chat-header';
import { ChatInput } from '@/app/components/chat/chat-input';
import ChatMessages from '@/app/components/chat/ChatMessages'; 

export default function Home() { //this is the main component
  return (
    <div className="bg-[#79899e] w-full h-full flex flex-col min-h-screen">
      <ChatHeader 
        name="Some Channel Name" 
        serverId="123" 
        type="channel" 
      />
     
      <ChatMessages /> 

      <div className="mt-auto w-full"> 
        <ChatInput 
          name="Some Channel Name" 
          type="channel" 
          apiUrl="/api/socket/messages"
          query={{
            channelId: "channel-id",
            serverId: "server-id",
          }}
        />
      </div>
    </div>
  );
}


{/*
mt-auto: This pushes the chat input box to the bottom of the screen. It ensures that no matter how many messages there are, the input field will always be at the bottom.
w-full: Makes the chat input box take the full width of the screen.

/api/socket/messages is an API endpoint used by the chat app to send and receive messages.
/channelId: A unique identifier for the chat channel 
/serverId: A unique identifier for the server

*/}