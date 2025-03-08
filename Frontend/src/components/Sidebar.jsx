
import React, { useEffect, useState } from 'react';
import useToggle from '../hooks/useToggle';
import SidebarSearchInput from './SidebarSearchInput';
import { checkServerStatus, fetchConversations } from '../services/apiServices';
import { PiNotePencil } from 'react-icons/pi';
import { IoMenu, IoSearch } from 'react-icons/io5';

export default function Sidebar({ toggleSidebarOpen }) {
  const [showSearch, ToggleShowSearch] = useToggle(false);
  // const [conversations, setConversations] = useState([]);
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Chat 1' },

  ]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const get_conversations = async () => {
    try {
      const server_status = await checkServerStatus();
      console.log(server_status)
      const data = await fetchConversations();
      console.log(data);
      setConversations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch conversations from the backend
    if (conversations.length === 0) {
      get_conversations();
    }
  }, []);

  const handleConversationClick = (conversation_id) => {
    setSelectedConversation(conversation_id);
  };

  return (
    <div className="w-full  bg-gray-700 text-white ">
      <div className="h-screen flex flex-col  ">
        <div className="p-4 flex item-center justify-between sidebar-top ">
          <button className='open-sidebar text-white hover:bg-gray-800 p-1 rounded-xl' onClick={toggleSidebarOpen}><IoMenu size={'1.5rem'} /></button>
          <div className="flex items-center gap-3 ">
            <button className='search-icon text-white hover:text-gray-300 p-1 rounded-xl' onClick={ToggleShowSearch}><IoSearch size={'1.5rem'} /></button>
            <button className='create-new-chat  text-white hover:bg-gray-800 p-1 rounded-xl' ><PiNotePencil size={'1.5rem'} /></button>
          </div>
          {showSearch && (
            <div className="absolute top-0 left-0 w-full p-2 ">
              <SidebarSearchInput ToggleShowSearch={ToggleShowSearch} />
            </div>
          )}
        </div>

        {/* converstations list */}

        <div className='flex-grow overflow-y-scroll px-2'>
          <div className="">
            <h3 className="px-4 py-2 mb-2 text-xl font-medium    mt-4">ChatGpt2.0</h3>
          </div>
          <ul className="flex flex-col gap-1">
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${conversation.id === selectedConversation ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
              >
                {conversation.name}
              </li>
            ))}
          </ul>
        </div>


        {/* divider */}
        {/* <div className="h-[1.5px] my-2 rounded-lg w-full bg-gray-500"></div> */}
        <div className=" sidebar-bottom">
          {/* onclick profile open popover  */}
          <div className="profile-card flex items-center gap-3 p-4 hover:bg-gray-600 rounded-lg cursor-pointer">
            {/* profile image */}
            <div className="avatar w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium">U</span>
            </div>
            <div className="user-info">
              <h4 className=" font-medium">User Name</h4>
              <p className="text-xs text-gray-300">user@example.com</p>
            </div>
          </div>
        </div>


      </div>

    </div>
  );
}