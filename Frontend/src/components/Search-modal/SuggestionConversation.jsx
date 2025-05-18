import React from 'react'
import { useSidebar } from '../../context/SidebarContext';
import { useNavigate } from 'react-router-dom';

export default function SuggestionConversation({ conversation,toggleShowSearch }) {
  if (!conversation) return null;
  const {setConversations} = useSidebar();
  const navigate = useNavigate();
  const handleClick = () => {
    setConversations((convs) => {
      // Remove if already exists
      const filtered = convs.filter(c => c.id !== conversation.id);
      // Add to top
      return [conversation, ...filtered];
    });
  
    toggleShowSearch();
    navigate(`/c/${conversation.token}`);

  }

  return (
    <li onClick={handleClick} className="flex justify-between items-center px-4 py-2 rounded-lg hover:bg-gray-800  cursor-pointer transition-colors duration-300 group">
      <span className="font-medium truncate">{conversation.name}</span>
      <span className="text-xs text-gray-400 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {conversation.updated_at && new Date(conversation.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </li>
  );
}


