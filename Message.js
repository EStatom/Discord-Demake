// This component will format individual chat messages
const Message = ({ sender, timestamp, content }) => {
    return (
      <div className="flex items-start space-x-3 p-4">
        <div className="bg-gray-700 p-2 rounded-lg text-white max-w-[75%]">
          <p className="font-bold">{sender}</p> {/* Display sender's name */}
          <p>{content}</p> {/* Display the message content */}
          <span className="text-sm text-gray-400">{timestamp}</span> {/* Display timestamp */}
        </div>
      </div>
    );
  };
  
  export default Message;
  
// note that the work is a stack page, so we need other team members to replace by active work

  {/*const Message: This defines a functional component named Message.
({ sender, timestamp, content }): These are the props (short for "properties") that the component expects to receive. This is called destructuring, where sender, timestamp, and content are pulled out from the props object.
sender: The name of the person who sent the message.
timestamp: The time when the message was sent.
content: The actual text of the message.*/}

{/*flex: This makes the content inside the container flexible, meaning it will arrange the child elements (message bubble, etc.) in a row.
items-start: Aligns the child elements at the top (start) of the container.
space-x-3: Adds horizontal spacing of 3 units between elements inside the container.
p-4: Adds padding (space inside the box) around the entire message, making it look clean and spaced out.*/}