"use client"; // Since you're using useState

import { Menu, Hash, Search } from "lucide-react"; // Add the Search icon
{/* Menu, Hash, Search: These are icons imported from a library called "lucide-react" to give the chat header some visual icons for better UI. */}

import { useState } from "react"; // We'll use this to manage the search input
//useState: A hook that allows you to add and manage state in a functional component (like remembering what the user types in an input).
import { FC } from "react"; // Import FC from React
// FC: A TypeScript type that lets you define a React component as a functional component, making it easier to work with in TypeScript.
// Define the type for the props

//
// note that the work is a stack page, so we need other team members to replace by active work

interface ChatHeaderProps {
  name: string;
  serverId: string;
  type: "channel" ; // Assuming type can be "channel"  (you can adjust as needed)
}

// ChatHeader component with search bar
export const ChatHeader: FC<ChatHeaderProps> = ({ name, serverId, type }) => { // note that the work is a stack page, so we need other team members to replace by active work

  const [searchTerm, setSearchTerm] = useState(''); // Manage search input

  // Function to handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('Searching for:', e.target.value); // You can replace this with actual search logic
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 text-white border-b border-gray-700">
      {/*className="flex items-center justify-between": This applies CSS classes from Tailwind CSS. It makes the content inside the div flexible (arranged in a row), aligns the items vertically in the center (items-center), and spaces them out evenly (justify-between)*/}
      {/*p-4: Adds padding around the content*/}
      {/*bg-gray-900 text-white: The background color is dark gray, and the text color is white.*/}
      {/*border-b border-gray-700: Adds a bottom border in a slightly lighter gray.
*/}
      {/**/}
      {/**/}

      <div className="flex items-center space-x-2">
        <Menu className="w-5 h-5" />
              {/*<Menu className="w-5 h-5" />: This renders a menu icon with width and height of 5 units. This could represent options/settings.*/}

        {type === "channel" && (
          //      {/*type === "channel" && (<Hash className="w-5 h-5" />)}: This checks if the type prop is "channel". If it is, it displays a # icon (common for channels).*/}

          <Hash className="w-5 h-5" />
        )}
        <span className="font-semibold"># {name}</span> {/*This displays the name of the channel or direct message */}
      </div>

      {/* Search bar */}
      <div className="flex items-center bg-gray-700 rounded-lg p-2 space-x-2 w-[40%]">
        <Search className="w-5 h-5 text-gray-400" />
              {/*bg-gray-700: Sets a darker gray background for the search bar.*/}
               {/*rounded-lg: Adds rounded corners to the search bar.*/}
               {/* p-2: Adds padding around the search bar content.*/}
               {/*space-x-2: Adds space between the search icon and the input field.*/}
               {/*w-[40%]: Sets the width of the search bar to 40% of the available space in the header*/}

        <input
          type="text" 
          placeholder="Search..." //placeholder="Search...": This is the placeholder text that appears when the input is empty.
          value={searchTerm}
          onChange={handleSearch}
          //onChange={handleSearch}: Whenever the user types something, the handleSearch function is called to update the searchTerm value.
          className="bg-transparent text-white border-none outline-none w-full"
        />
      </div>
      {/*className="bg-transparent text-white border-none outline-none w-full": This removes the background and borders for the input, makes the text white, and ensures the input field takes up the full width (w-full)*/}

      <div className="bg-gray-800 px-3 py-1 rounded-lg text-gray-300">
        Server: {serverId}
      </div>
    </div>
  );
};

export default ChatHeader;
