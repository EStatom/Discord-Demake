import { useEffect, useState } from 'react';
import { listenForMessages } from '../firebase';  
import Message from './message';  

const ChatMessages = ({ searchTerm }) => {
  //searchTerm is responsible for displaying messages and highlighting them based on a search term
  const [messages, setMessages] = useState([]);
  //messages: This is a state variable that will store an array of messages.
  //setMessages: This is the function used to update the messages state.
  useEffect(() => {
    const unsubscribe = listenForMessages((newMessages) => { //listenForMessages(): update the messages in firebase, (new messages)
      setMessages(newMessages);
    });
    return () => unsubscribe();  
  }, []);

  
  const highlightText = (text, highlight) => { 
    // it is responsible to highlight the search term in message content
    if (!highlight.trim()) {
       //.trim() : it is resposible to remove spaces from both the beginning and end of the search term.
      return text;
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
     // The split() method divides the given text into an array of smaller pieces (parts).
     // new RegExp(): regular expression
     //The (${highlight}): it is to include the search term itself in the resulting array.
     //g: It is to search for all matches in the text, not just the first one.
     //i: lowercase
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? 
    //part.toLowerCase(): covert to lowercase then highlight it
      <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : 
      part
    );
  };

  return (
    <div className="p-4 flex-1 overflow-y-auto"> {/*we talled abouth them alot*/}
      {messages.map((msg, index) => (
        <Message
          key={index}
          //key={index}: this is a unique identifier for each Message
          sender={msg.sender}
          //msg.sender: contains the name or identifier of the person who sent the message.
          content={highlightText(msg.content, searchTerm)}  
          //This function takes two arguments: the content of the message (msg.content) and the search term (searchTerm).
          timestamp={msg.timestamp}
          //The msg.timestamp contains the time the message was sent
        />
      ))}
    </div>
  );
};

export default ChatMessages;
