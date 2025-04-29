
import React, { useEffect, useState } from 'react';
import { checkServerStatus, fetchConversations } from '../services/apiServices';
import { IoMenu, IoSearch } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import ConversationLink from './sidebar-compnents/ConversationLink';
import { RiChatNewLine } from 'react-icons/ri';
import SidebarTop from './sidebar-compnents/SidebarTop';
import SidebarProfileCard from './sidebar-compnents/SidebarProfileCard';

export default function Sidebar() {
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
    // toggleSidebarOpen();
    // navigate('/');
    console.log('new chat created');
  }


  // change the name in conversations state
  const isNewChat =  location.pathname === '/'
  
  const TempConv =({name})=>{
    return(
      <div className='flex  flex-col gap-2 px-3 py-2 hover:bg-gray-800 cursor-pointer rounded-lg transition-colors '>
        {/* <div className='w-2 h-2 bg-green-500 rounded-full'></div> */}
        <p className='text-gray-200 font-medium'>{name.length > 30 ? name.substring(0, 30) + '...' : name}</p>
        <p className="text-sm text-gray-400">{`hellow guey howe are this is new conversation dummy data , i am going to become the world one of the richest person and i am going to give my 100% to reach there`.substring(0, 35)}...</p>
      </div>    )
  }

  return (
    <div className="w-full   text-white h-screen">
      {/* sidebar top */}
      <SidebarTop/>
      {/* sidebar middle */}
      <div className='overflow-y-auto p-2 bg-gray-900 h-[calc(100vh-9rem)]'>
        <div className="p-2">
          <button onClick={()=>handleCreateNewChat()} disabled={isNewChat} className='bg-purple p-3  flex items-center gap-4 w-full rounded-lg justify-center hover:bg-purple/90 active:bg-purple/90 transition-colors'>
          <RiChatNewLine className='w-5 h-auto'/>
          <span className="font-medium">
          New Chat
            </span>
          </button>
        </div>
        <div className="mt-4">
          <h3 className="py-2 px-3 text-gray-400 font-semibold text-sm">Recent Conversation</h3>
          <ul className="flex flex-col gap-1 ">
            {/* {conversations.map((conversation) => (
            <ConversationLink key={conversation.id} conversation={conversation} onClickLink={handleConversationClick} selectedConversation={selectedConversation} setConversations={setConversations} />
            ))} */}

            {/* for identify current chat mark it with dot  */}
            <TempConv name='New Chat'/>
            <TempConv name='New Chat 2'/>
            <TempConv name='New Chat 3'/>
            <TempConv name='New Chat 4'/>
            <TempConv name='Django Version 5.2 have the one of the best features ever in django'/>
          </ul>
        </div>
      </div>


      {/* user profile card  */}
      <SidebarProfileCard/>

    </div>
  );
}