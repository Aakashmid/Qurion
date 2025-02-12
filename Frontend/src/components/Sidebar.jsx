import { ArrowBack, Book, Lens, LensRounded, Menu, Search, SearchRounded } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import useToggle from '../hooks/useToggle';
import SidebarSearchInput from './SidebarSearchInput';
import { checkServerStatus, fetchConversations } from '../services/apiServices';

export default function Sidebar({ toggleSidebarOpen }) {
  const [showSearch, ToggleShowSearch] = useToggle(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const get_conversations = async () => {
    try {
      const server_status =await checkServerStatus();
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
    <div className="w-full h-full bg-gray-700 text-white">
      <div className="p-4">
        <div className="flex item-center justify-between sidebar-top">
          <button className='open-sidebar text-white hover:bg-gray-800 p-1 rounded-full' onClick={toggleSidebarOpen}><Menu /></button>
          <div className="flex items-center gap-2">
            <button className='create-new-chat text-white'><Book /></button>
            <button className='search-icon text-white' onClick={ToggleShowSearch}><Search /></button>
          </div>
          {showSearch && (
            <SidebarSearchInput ToggleShowSearch={ToggleShowSearch} />
          )}
        </div>
        <h3 className="text-lg font-medium px-4 py-2 mt-4">Conversations</h3>
        <hr className='my-2' />
        <div>
          <ul className="space-y-2">
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className={`px-4 py-2 rounded-md cursor-pointer transition-colors duration-200 ${conversation.id === selectedConversation ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
              >
                {conversation.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}