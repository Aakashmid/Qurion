// src/hooks/useConversation.js
import { useState, useEffect, useCallback } from 'react';
import { CreateConversation, fetchConversationMessages } from '../services/apiServices';
import useSocket from './useSocket';

export default function useConversation(initialToken) {
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isConnected, newResponse, sendOverSocket, socketError] =
    useSocket(token, import.meta.env.VITE_WS_CONVERSATION_URL);

  
  useEffect(()=>{setToken(initialToken)},[initialToken])

  // Fetch a page of messages
  const loadMessages = useCallback(async (pageNum = 1) => {
    console.log('loadMessages called', pageNum);
    try {
      setLoading(true);
      // const { results, next } = await fetchConversationMessages(token, pageNum);
      const data = await fetchConversationMessages(token, pageNum);
      setMessages(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
      setHasMore(!!data.next);
    } catch (err) {
      console.log(err)
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Handle real-time updates
  useEffect(() => {
    if (newResponse) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].response_text = newResponse.response_text;
        return updated;
      });
    }
  }, [newResponse]);

  useEffect(() => {
    if (socketError) setError(socketError);
  }, [socketError]);

  // Send a new user message
  const sendMessage = async (requestText) => {
    try {
      if (!token) {
        const resp = await CreateConversation(requestText);
        setToken(resp.token);
      } else {
        setMessages(prev => [...prev, { request_text: requestText, response_text: '' }]);
        sendOverSocket({ request_text: requestText });
      }
    } catch (err) {
    console.log('Error sending message:', err);
      setError(err);
    }
  };

  // // Infinite scroll loader
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(p => p + 1);
      loadMessages(page + 1);
    }
  };

  // On token change or first load
  useEffect(() => {
    if (token) {
      loadMessages(1);
    }
    else setMessages([]);
  }, [token]);


  useEffect(() => {
    if (!socketError) {
      clearError();
    }
  }, [socketError]);

  // Clear error state
    const clearError = () => {
      setError(null);
    };

    
  
  return {
    messages,
    loading,
    error,
    sendMessage,
    loadMore,
    isConnected,
    clearError,
  };
}
