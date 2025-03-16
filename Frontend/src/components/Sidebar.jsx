
import React, { useEffect, useState } from 'react';
import useToggle from '../hooks/useToggle';
import SidebarSearchInput from './SidebarSearchInput';
import { checkServerStatus, fetchConversations } from '../services/apiServices';
import { PiDot, PiDotsThree, PiNotePencilDuotone, PiThreeDBold } from 'react-icons/pi';
import { IoMenu, IoSearch } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import ConversationLink from './side-bar-comps/ConversationLink';

export default function Sidebar({ toggleSidebarOpen }) {
  const [showSearch, ToggleShowSearch] = useToggle(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const get_conversations = async () => {
    try {
      // const server_status = await checkServerStatus();
      // console.log(server_status);
      const data = await fetchConversations();
      if (data?.results?.length > 0) {
        setConversations(data.results);
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch conversations from the backend
    // if (conversations.length === 0) {
    get_conversations();
    // }
  }, []);

  const handleConversationClick = (conversation) => {
    navigate(`/c/${conversation.token}`);
    setSelectedConversation(conversation.id);
    if (window.innerWidth < 800)
      toggleSidebarOpen();
  };

  const handleCreateNewChat = () => {
    toggleSidebarOpen();
    navigate('/');
  }


  // change the name in conversations state
  const isNewChat = () => {
    return location.pathname === '/'
  }

  return (
    <div className="w-full  bg-gray-700 text-white ">
      <div className="h-screen flex flex-col  ">
        <div className="p-4 flex item-center justify-between sidebar-top ">
          <div className="flex items-center gap-3">
            <button className='open-sidebar text-white hover:bg-gray-800 p-1 rounded-xl' onClick={toggleSidebarOpen}><IoMenu className='w-7 lg:w-8 h-auto' /></button>
            <h3 className="p-1 text-xl lg:text-2xl font-medium ">Proxima</h3>
          </div>
          <div className="flex items-center gap-3 ">
            <button className='search-icon text-white hover:text-gray-300 p-1 rounded-xl' onClick={ToggleShowSearch}><IoSearch className='w-7  h-auto' /></button>
            <button disabled={isNewChat} className='create-new-chat  text-white hover:bg-gray-800 p-1 rounded-xl' onClick={() => handleCreateNewChat()} ><PiNotePencilDuotone className='w-7 h-auto ' /></button>
          </div>
          {showSearch && (
            <div className="absolute top-0 left-0 w-full p-2 ">
              <SidebarSearchInput ToggleShowSearch={ToggleShowSearch} />
            </div>
          )}
        </div>

        {/* converstations list */}

        <div className='flex-grow overflow-y-auto p-2'>
          <ul className="flex flex-col gap-1 ">
            {conversations.map((conversation) => (
              <ConversationLink key={conversation.id} conversation={conversation} onClickLink={handleConversationClick} selectedConversation={selectedConversation} setConversations={setConversations} />
            ))}
          </ul>
        </div>


        {/* divider */}
        {/* <div className="h-[1.5px] my-2 rounded-lg w-full bg-gray-500"></div> */}
        <div className=" sidebar-bottom">
          {/* onclick profile open popover  */}
          <div className="profile-card flex items-center gap-3 p-4 transition-all active:bg-gray-700 bg-gray-600 rounded-lg cursor-pointer">
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