
import React, { use, useEffect, useRef, useState } from 'react';
import { checkServerStatus, fetchConversations } from '../services/apiServices';
import { IoMenu, IoReload, IoSearch } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import ConversationLink from './sidebar-components/ConversationLink';
import { RiChatNewLine } from 'react-icons/ri';
import SidebarTop from './sidebar-components/SidebarTop';
import SidebarProfileCard from './sidebar-components/SidebarProfileCard';

import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { toggleSidebarOpen, conversations, getConversations, loading, loadMoreConversations, hasMore } = useSidebar();
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
    getConversations();
  }, [access_token])

  // change the name in conversations state
  const isNewChat = location.pathname === '/'



  const bottomRef = useRef(null);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const element = bottomRef.current;
  //     // if (!element || !hasMore || loading) return;

  //     const rect = element.getBoundingClientRect();
  //     const isNearBottom = rect.top <= window.innerHeight + 300;

  //     if (isNearBottom) {
  //       console.log('loaded more');
  //       loadMoreConversations();
  //     }
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);
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
            {loading && <div className='flex justify-center items-center text-gray-400 text-sm'>Loading…</div>}
            
            {hasMore && !loading && (
              <button
                onClick={loadMoreConversations}
                className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-4 justify-center"
              >
                Load More <IoReload />
              </button>
            )}

          </ul>
        </div>
      </div>


      {/* user profile card  */}
      <SidebarProfileCard />

    </div>
  );
}