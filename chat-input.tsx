"use client";
{/* It is responsible for updating what the user sees and interacts (client-side component). */}

// emojiObject
interface EmojiObject {
  emoji: string;
}

// Import necessary  Smile and Send icons.
import { Smile, Send } from "lucide-react"; 
//This line brings in two icons from the lucide-react library.
import { useState } from "react"; // React hook for managing state (for example to send an emoji)
{/*useState: This hook allows you to create a state variable (searchTerm) to store the current value of the search input.*/}
import EmojiPicker from 'emoji-picker-react'; 


// ChatInput Component
  // Function to handle sending the message

export const ChatInput = () => {
  // State variables for message input and emoji picker visibility
  const [message, setMessage] = useState('');
  // message: This is the current value of the chat input (what the user has typed).
  // setMessage: This is the function that you call whenever you want to change or update the value of message.
  //useState('') initializes the message state as an empty string, and setMessage is the function to update it as the user types.
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
   // showEmojiPicker: This is a boolean (either true or false) that tells whether the emoji picker is currently shown (true) or hidden (false).
  //setShowEmojiPicker: A function to update the showEmojiPicker state.
  
   const sendMessage = () => {
    if (message.trim() !== '') { // Check if the message is not just empty spaces
      //.trim() :  This is a string method that removes any extra spaces from the beginning and end of the text. 
      console.log("Message sent:", message); 
      // console.log is a function used for printing messages
      setMessage(''); // Clear the input field after sending the message
    }
  };

  // Function to handle the 'Enter' key press to send a message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    
   // React.KeyboardEvent<HTMLInputElement>: This is TypeScript-specific. It tells us that this event (e) is a keyboard event on an input element.

    if (e.key === 'Enter') {
      {/*e.key: This accesses the key that was pressed during the event. Every time the user presses a key, the event e stores information about which key was pressed*/}
      {/*=== 'Enter': This condition checks if the key that was pressed is the Enter key. If it is, the condition is true, and the code inside the if block will run. If the user pressed any other key (like 'A' or 'B'), the condition will be false, and the function won’t do anything.*/}
      sendMessage(); // Call sendMessage when the 'Enter' key is pressed
    }
  };

  // Function to handle emoji selection
  const onEmojiClick = (emojiObject: { emoji: string }) => {
    //emojiObject: { emoji: string }: is a string representing the emoji character.
    setMessage(prevMessage => prevMessage + emojiObject.emoji); // Append the selected emoji to the message
  };
  //prevMessage: The current message the user has already typed.
//emojiObject.emoji: The emoji that the user just selected.
//prevMessage: This is the message that the user has already typed before selecting the emoji.
//prevMessage + emojiObject.emoji = the typed message + the selected emoji
{/*setMessage(prevMessage => prevMessage + emojiObject.emoji): This updates the message that the user is typing.*/}
  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      {/*
      p-4: Adds space around the chat box.
      
      */}
      
      <div className="flex items-center space-x-2 w-full bg-gray-700 p-2 ">
       
      
        <input
          type="text"
          placeholder="Type your message here..."
          //placeholder="Type your message here...": Displays text inside the input field when it's empty to give the user a hint about what to do.
          className="w-full bg-transparent text-white border-none outline-none"
          value={message}
          //value={message}: This binds the current message state to the input field. It makes sure that whatever the user types (or any emojis added) is displayed in the input field.
          onChange={(e) => setMessage(e.target.value)} 
           //onChange={(e) => setMessage(e.target.value)}: Whenever the user types something, this updates the message state with the new value (e.target.value is what the user typed).

          onKeyDown={handleKeyPress} 
          //onKeyDown={handleKeyPress}: Detects when the user presses a key. In this case, it listens for the Enter key to send the message when pressed.
        />

        {/* Emoji picker toggle button */}
        <button className="p-1 text-white" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile className="w-5 h-5" /> {/* Smile icon for emoji picker */}
          
        </button>
        {/* Send button */}
        <button className="p-1 text-white" onClick={sendMessage}>
          <Send className="w-5 h-5" /> {/* Send button with icon with 5x5 size*/}

        </button>
                  {/*onClick={() => setShowEmojiPicker(!showEmojiPicker)}: When the button is clicked, it flips the showEmojiPicker state. If the emoji picker is currently hidden, clicking the button will show it, and vice versa.*/}

      </div>

      {/* Emoji Picker that toggles on button click */}
      {showEmojiPicker && (
        <div className="absolute bottom-14 right-0">
          
          {/*bottom-14 (vertical): This positions the bottom of the emoji picker 14 units above the bottom of the screen.*/}
          {/*right-0 (horizontal) : This makes the emoji picker align to the right side of the screen (or chat box).*/}
          {/*absolute: This positions the emoji picker absolutely relative to the chat input box, meaning you can place it anywhere on the screen.*/}
          <EmojiPicker onEmojiClick={onEmojiClick} /> {/* Emoji picker display when button is clicked */}
        </div>
        // showEmojiPicker && (...): Displays the emoji picker only when the state showEmojiPicker is true.
        //showEmojiPicker is true, If the user has clicked the smiley button, this condition will be true and the emoji picker will appear.
      )}
    </div>
  );
};

export default ChatInput;
