import { useState } from 'react';
import { Menu, Hash, Search } from 'lucide-react';

const ChatHeader = ({ name, serverId, type, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
// searchTerm: it is to store what the user has typed into the search bar.
// setSearchTerm: This is a function that updates searchTerm. Whenever the user types something new, setSearchTerm will update it.
  const handleSearch = (e) => { // Whenever the user types in the search box, it will update.
    const value = e.target.value; // this part is updating the search term (the text in the search box) with whatever the user types.
    setSearchTerm(value);   
    onSearch(value);      
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 text-white border-b border-gray-700">
      {/*className="flex items-center justify-between": This applies CSS classes from Tailwind CSS. It makes the content inside the div flexible (arranged in a row), aligns the items vertically in the center (items-center), and spaces them out evenly (justify-between)*/}
      {/*p-4: Adds padding around the content*/}
      {/*bg-gray-900 text-white: The background color is dark gray, and the text color is white.*/}
      {/*border-b border-gray-700: Adds a bottom border in a slightly lighter gray.*/}
      <div className="flex items-center space-x-2">
        <Menu className="w-5 h-5" />
                 {/*<Menu className="w-5 h-5" />: This renders a menu icon with width and height of 5 units. This could represent options/settings.*/}

        {type === "channel" && <Hash className="w-5 h-5" />}
                   {/*type === "channel" && (<Hash className="w-5 h-5" />)}: This checks if the type prop is "channel". If it is, it displays a # icon (common for channels).*/}
        <span className="font-semibold"># {name}</span>
                {/*This displays the name of the channel or direct message */}

      </div>
      <div className="flex items-center bg-gray-700 rounded-lg p-2 space-x-2 w-[40%]">
        <Search className="w-5 h-5 text-gray-400" />
        {/*bg-gray-700: Sets a darker gray background for the search bar.*/}
               {/*rounded-lg: Adds rounded corners to the search bar.*/}
               {/* p-2: Adds padding around the search bar content.*/}
               {/*space-x-2: Adds space between the search icon and the input field.*/}
               {/*w-[40%]: Sets the width of the search bar to 40% of the available space in the header*/}
        <input
          type="text"
          placeholder="Search..."  //placeholder="Search...": This is the placeholder text that appears when the input is empty.
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
