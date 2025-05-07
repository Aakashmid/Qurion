
import React, { useEffect, useState } from 'react';
import { checkServerStatus, fetchConversations } from '../services/apiServices';
import { IoMenu, IoSearch } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import ConversationLink from './sidebar-compnents/ConversationLink';
import { RiChatNewLine } from 'react-icons/ri';
import SidebarTop from './sidebar-compnents/SidebarTop';
import SidebarProfileCard from './sidebar-compnents/SidebarProfileCard';

import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { toggleSidebarOpen, conversations, get_conversations } = useSidebar();
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { access_token } = useAuth();

  const handleConversationClick = (conversation) => {
    navigate(`/c/${conversation.token}`);
    setSelectedConversation(conversation.id);
    if (window.innerWidth < 800) {
      toggleSidebarOpen();
    }
  };

  const handleCreateNewChat = () => {
    if (window.innerWidth < 768) {
      toggleSidebarOpen();
    }
    navigate('/');
    console.log('new chat created');
  }


  useEffect(() => {
    get_conversations();
  }, [access_token])

  // change the name in conversations state
  const isNewChat = location.pathname === '/'


  return (
    <div className="w-full   text-white h-screen">
      {/* sidebar top */}
      <SidebarTop />
      {/* sidebar middle */}
      <div className=' p-2 bg-gray-900 h-[calc(100vh-9rem)] flex flex-col '>
        <div className="p-2">
          <button onClick={() => handleCreateNewChat()} disabled={isNewChat} className='bg-purple  p-2 lg:p-3  flex items-center gap-4 w-full rounded-lg justify-center hover:bg-purple/90 active:bg-purple/90 transition-colors'>
            <RiChatNewLine className='w-5 h-auto' />
            <span className="font-medium">
              New Chat
            </span>
          </button>
          {/* <button onClick={()=>{get_conversations()}} className='p-2 bg-gray-200 hover:bg-gray-300 text-black mt-2 rounded-2xl'>Fetch Conversations</button> */}
        </div>

        <h3 className="py-1 px-3 text-gray-400 font-semibold text-sm">Recent Conversation</h3>
        <div className="mt-4 overflow-y-auto scrollbar-dark flex-grow">
          <ul className="flex flex-col gap-1 ">
            {conversations.map((conversation) => (
              <ConversationLink key={conversation.id} conversation={conversation} onClickLink={handleConversationClick} selectedConversation={selectedConversation} />
            ))}

          </ul>
        </div>
      </div>


      {/* user profile card  */}
      <SidebarProfileCard />

    </div>
  );
}