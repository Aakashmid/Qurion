import React, { createContext, useState, useContext, useEffect } from 'react';
import useToggle from '../hooks/useToggle';
import { fetchConversations } from '../services/apiServices';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, toggleSidebarOpen] = useToggle(window.innerWidth >= 768 ? true : false);
    const [conversations, setConversations] = useState([]);


    const get_conversations = async () => {
        try {
            // const server_status = await checkServerStatus();
            // console.log(server_status);
            // keep in my about , you have to do about pagination of conversation also 
            const data = await fetchConversations();
            if (data.results.length > 0) {
                setConversations(data.results);
            }
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebarOpen, get_conversations, conversations, setConversations }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);