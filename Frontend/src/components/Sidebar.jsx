
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
  const {toggleSidebarOpen} = useSidebar();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const {accessToken} = useAuth();

  const get_conversations = async () => {
    try {
      // const server_status = await checkServerStatus();
      // console.log(server_status);
      const data = await fetchConversations();

      // if (data?.results?.length > 0) {
      if (data?.length > 0) {
        setConversations(data);
        console.log(data)
      }

    } catch (error) {
      console.error(error);
    }
  };


  // update conversation state when new conversation is created
  useEffect(() => {
    // console.log(accessToken)
    // Fetch conversations from the backend
    // if (conversations.length === 0) {
    console.log(accessToken)
    get_conversations();
    // }
  }, [accessToken]);

  const handleConversationClick = (conversation) => {
    navigate(`/c/${conversation.token}`);
    setSelectedConversation(conversation.id);
    if (window.innerWidth < 800){
      toggleSidebarOpen();
    }
  };

  const handleCreateNewChat = () => {
    // toggleSidebarOpen();
    // navigate('/');
    console.log('new chat created');
  }


  // change the name in conversations state
  const isNewChat =  location.pathname === '/'
  
  
  return (
    <div className="w-full   text-white h-screen">
      {/* sidebar top */}
      <SidebarTop/>
      {/* sidebar middle */}
      <div className='overflow-y-auto p-2 bg-gray-900 h-[calc(100vh-9rem)]'>
        <div className="p-2">
          <button onClick={()=>handleCreateNewChat()} disabled={isNewChat} className='bg-purple  p-2 lg:p-3  flex items-center gap-4 w-full rounded-lg justify-center hover:bg-purple/90 active:bg-purple/90 transition-colors'>
          <RiChatNewLine className='w-5 h-auto'/>
          <span className="font-medium">
          New Chat
            </span>
          </button>
          {/* <button onClick={()=>{get_conversations()}} className='p-2 bg-gray-200 hover:bg-gray-300 text-black mt-2 rounded-2xl'>Fetch Conversations</button> */}
        </div>
        <div className="mt-4">
          <h3 className="py-2 px-3 text-gray-400 font-semibold text-sm">Recent Conversation</h3>
          <ul className="flex flex-col gap-1 ">
            {conversations.map((conversation) => (
            <ConversationLink key={conversation.id} conversation={conversation} onClickLink={handleConversationClick} selectedConversation={selectedConversation} setConversations={setConversations} />
            ))}

          
          </ul>
        </div>
      </div>


      {/* user profile card  */}
      <SidebarProfileCard/>

    </div>
  );
}