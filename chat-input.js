import { useState } from 'react';
import { Smile, Send } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { sendMessageToFirebase } from '../firebase';  

const ChatInput = () => {
  const [message, setMessage] = useState('');
  // message: This is the current value of the chat input (what the user has typed).
  // setMessage: This is the function that you call whenever you want to change or update the value of message.
  //useState('') initializes the message state as an empty string, and setMessage is the function to update it as the user types.
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
// showEmojiPicker: This is a boolean (either true or false) that tells whether the emoji picker is currently shown (true) or hidden (false).
  //setShowEmojiPicker: A function to update the showEmojiPicker state.
  const sendMessage = () => {
    if (message.trim() !== '') {  // Check if the message is not just empty spaces
            //.trim() :  This is a string method that removes any extra spaces from the beginning and end of the text. 
      sendMessageToFirebase(message); 
       // to send message to Firebase
      setMessage(''); 
       // to clear the input  after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      {/*e.key: This accesses the key that was pressed during the event. Every time the user presses a key, the event e stores information about which key was pressed*/}
      {/*=== 'Enter': This condition checks if the key that was pressed is the Enter key. If it is, the condition is true, and the code inside the if block will run. If the user pressed any other key (like 'A' or 'B'), the condition will be false, and the function won’t do anything.*/}

      sendMessage();
       //Call sendMessage when the 'Enter' key is pressed
    }
  };

  const onEmojiClick = (emojiObject) => {
        //emojiObject: it is a string representing the emoji character.

    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
        // Append the selected emoji to the message// Append the selected emoji to the message

  };
//prevMessage: The current message the user has already typed.
//emojiObject.emoji: The emoji that the user just selected.
//prevMessage: This is the message that the user has already typed before selecting the emoji.
//prevMessage + emojiObject.emoji = the typed message + the selected emoji
{/*setMessage(prevMessage => prevMessage + emojiObject.emoji): This updates the message that the user is typing.*/}
  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">

       {/*p-4: Adds space around the chat box.*/}
      <div className="flex items-center space-x-2 w-full bg-gray-700 p-2">
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
        <button className="p-1 text-white" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile className="w-5 h-5" />
        </button>
        <button className="p-1 text-white" onClick={sendMessage}>
          <Send className="w-5 h-5" />
        </button>
      </div>
      {showEmojiPicker && (
        <div className="absolute bottom-14 right-0">
          {/*bottom-14 (vertical): This positions the bottom of the emoji picker 14 units above the bottom of the screen.*/}
          {/*right-0 (horizontal) : This makes the emoji picker align to the right side of the screen (or chat box).*/}
          {/*absolute: This positions the emoji picker absolutely relative to the chat input box, meaning you can place it anywhere on the screen.*/}
          {/* Emoji picker display when button is clicked */}
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
         // showEmojiPicker && (...): Displays the emoji picker only when the state showEmojiPicker is true.
        //showEmojiPicker is true, If the user has clicked the smiley button, this condition will be true and the emoji picker will appear.

      )}
    </div>
  );
};

export default ChatInput;
