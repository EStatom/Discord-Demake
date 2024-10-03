
# my-discord-Chat dislay Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Setup Instructions](#setup-instructions)
3. [Code Structure](#code-structure)
4. [Component Descriptions](#components)
    - [ChatHeader](#chatheader-component)
    - [ChatInput](#chatinput-component)
    - [ChatMessages](#chatmessages-component)
    - [Message](#message-component)
5

---

## Project Overview
my-discord is a chat display that allows users to send and receive messages,


---

## Setup Instructions


1. Navigate to the project directory:
    ```bash
    cd my-discord
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open the app in the browser at:
    ```
    http://localhost:3000
    ```

---

## Code Structure
-**`app/`**: Contains the main application code.
  - **`components/`**: Contains reusable components for the chat application.
    - **`chat/`**: Contains components related to the chat interface.
      - **`chat-header.tsx`**: Renders the chat header, including the channel name and search bar.
      - **`chat-input.tsx`**: Provides the input field for typing and sending messages, as well as selecting emojis.
      opened.
      - **`ChatMessages.js`**: Manages and renders the list of chat messages.
      - **`Message.js`**: Formats and displays an individual message, showing the sender’s name, the message content, and the timestamp.
---

## Components

### ChatHeader Component
Icons: 
Menu: A menu icon representing the channel settings/options.
Hash: Displays the "#" symbol, used to indicate a chat channel.
Search: A magnifying glass icon representing the search functionality.


CSS Classes:
flex: Arranges the child elements horizontally.
items-center: Aligns child elements vertically in the center.
justify-between: Pushes child elements to the far left and right edges.
p-4: Adds padding around the content.
bg-gray-900: Sets the background color to dark gray.
text-white: Sets the text color to white.
border-b border-gray-700: Adds a bottom border to separate the header from the chat content.
flex items-center space-x-2: Aligns the icons and channel name in a horizontal row, with 2 units of space between them.
font-semibold: Makes the channel name bold.
bg-gray-700: Sets a background color for the search bar.
rounded-lg: Adds rounded corners to the search bar.
p-2: Adds padding inside the search bar.
w-[40%]: Sets the width of the search bar to 40% of the available space.
bg-transparent: Makes the input's background transparent.
text-white: Makes the text color white.
border-none: Removes any borders around the input.
outline-none: Removes the default outline when the input is focused.
w-full: Ensures the input takes up the full width of the search bar.

---

### ChatInput Component
Icons:
Plus, Smile, Send from lucide-react are used as icons for additional features (not yet implemented), the emoji picker, and the send button respectively.
useState from React:
A hook used to manage the state of the message and the emoji picker.
EmojiPicker:
A library component that provides an interface for selecting emojis.


type="text": Standard text input field for entering messages.
placeholder="Type your message here...": Displays placeholder text when the input is empty.
value={message}: Binds the input field to the message state variable, ensuring the input displays what the user types.
onChange={(e) => setMessage(e.target.value)}: Updates the message state whenever the user types.
onKeyDown={handleKeyPress}: Detects when the user presses a key and calls sendMessage() if the Enter key is pressed.
className="w-full bg-transparent text-white border-none outline-none":
w-full: Ensures the input field stretches to fill the available space.
bg-transparent: Makes the input field background transparent.
text-white: Ensures the text is white.
border-none outline-none: Removes borders and focus outlines for a clean look.
---

### ChatMessages Component
key={index}: The key prop is required by React to help identify each message uniquely in the list. Here, the index of the message in the array is used as the key.
sender={msg.sender}: The name of the sender is passed to the Message component as a prop.
content={msg.content}: The actual message text is passed as the content prop.
timestamp={msg.timestamp}: The time when the message was sent is passed as the timestamp prop.
p-4: Adds padding inside the container, spacing the content away from the edges.
flex-1: Allows the container to grow and fill all the available vertical space in the parent container.
overflow-y-auto: Ensures that the container can scroll vertically if the content (i.e., the messages) overflows the visible area.

### Message Component
-
- `sender` (string): The name of the person who sent the message.
- `timestamp` (string): The time the message was sent.
- `content` (string): The text of the message.
flex: Makes the content inside the container flexible and arranges the child elements in a row (i.e., the message bubble and potential future elements).
items-start: Aligns the child elements vertically at the top.
space-x-3: Adds horizontal spacing (3 units) between the child elements.
p-4: Adds padding around the entire message, ensuring that the message bubble has space around it.


