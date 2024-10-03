import Message from './Message'; // Import the Message component

// This component will handle the list of chat messages
const ChatMessages = () => {
  // Sample message data (you can replace this with real data)
  const messages = [
    { sender: 'User1', content: 'Hello!', timestamp: '10:45 AM' },
    { sender: 'User2', content: 'Hi there!', timestamp: '10:46 AM' },
    { sender: 'User1', content: 'How are you?', timestamp: '10:47 AM' },
  ];


    //p-4: Adds padding of 4 units around the content inside the <div>
    // flex-1: Tells the container to grow and take up all the available space in its flexbox layout.
    // overflow-y-auto: Enables vertical scrolling if the content inside the <div> overflows (when there are too many messages).
    // {messages.map((msg, index) => ( ... ))} messages is an array of chat messages. Each message has properties like sender, content, and timestamp.
    // This part renders a Message component for each message in the messages array. 
// For each message, three props are passed to the Message component:

// key={index}: The key is a unique identifier required by React when rendering lists. 
// In this case, the index of the message in the array is used as the key.

// sender={msg.sender}: This passes the sender’s name (like "User1" or "User2") 
// from the msg object to the Message component.

// content={msg.content}: This passes the actual message text 
// (like "Hello!" or "How are you?") to the Message component.

// timestamp={msg.timestamp}: This passes the time when the message was sent 
// (like "10:45 AM") to the Message component.
// note that the work is a stack page, so we need other team members to replace by active work
  return (
    <div className="p-4 flex-1 overflow-y-auto">
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

export default ChatMessages;
