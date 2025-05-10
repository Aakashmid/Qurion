import React, { createContext, useState, useContext } from 'react';
import useToggle from '../hooks/useToggle';
import { fetchConversations } from '../services/apiServices';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, toggleSidebarOpen] = useToggle(window.innerWidth >= 768);
    const [user,setUser] = useState(null);
    const [convMessages,setConvMessages] = useState({});
    const [conversations, setConversations] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);

    const getConversations = async () => {
        try {
            setLoading(true);
            const data = await fetchConversations();
            if (data.results.length > 0) {
                setConversations(data.results);
            }
            setHasMore(data.next !== null);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const loadMoreConversations = async () => {
        try {
            setLoading(true);
            const data = await fetchConversations(pageNum + 1);
            if (data.results.length > 0) {
                setConversations(prevConversations => [...prevConversations, ...data.results]);
                setPageNum(prevPageNum => prevPageNum + 1);
                setHasMore(data.next !== null);
            }
        } catch (error) {
            console.error('Error loading more conversations:', error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <SidebarContext.Provider
            value={{
                isSidebarOpen,
                toggleSidebarOpen,
                getConversations,
                loadMoreConversations,
                conversations,
                setConversations,
                hasMore,
                loading,
                user,
                setUser,
                
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};