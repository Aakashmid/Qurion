// src/hooks/useConversation.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { CreateConversation, fetchConversationMessages } from '../services/apiServices';
import useSocket from './useSocket';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

export default function useConversation(initialToken) {
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadedMore, setIsLoadedMore] = useState(false);  // for ensuer is messages is fetched again on loadmore
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const { setConversations } = useSidebar();

  const navigate = useNavigate();

  const currentRequestText = useRef('');
  const firstMessageRef = useRef(null);
  const responseBuffer = useRef('');
  const updateTimeout = useRef(null);

  const [isConnected, newResponse, sendOverSocket, socketError, stopStreaming] =
    useSocket(token, import.meta.env.VITE_WS_CONVERSATION_URL);

  // Sync initial token
  useEffect(() => {
    setToken(initialToken);
  }, [initialToken]);

  // Fetch paginated messages
  const loadMessages = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const data = await fetchConversationMessages(token, pageNum);
      setMessages(prev => (pageNum === 1 ? data.results : [...prev, ...data.results]));
      setHasMore(data.next !== null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Handle real-time streamed responses
  useEffect(() => {
    if (!newResponse) return;

    if (newResponse.type === 'response_chunk') {
      responseBuffer.current += newResponse.response_text;
      if (!updateTimeout.current) {
        updateTimeout.current = setTimeout(() => {
          setMessages(prev => {
            if (prev.length > 0) {
              return [{ ...prev[0], response_text: prev[0].response_text + responseBuffer.current }, ...prev.slice(1)];
            } else {
              return [{ request_text: currentRequestText.current, response_text: responseBuffer.current }];
            }
          });
          responseBuffer.current = '';
          updateTimeout.current = null;
        }, 100);
      }
    } else if (newResponse.type === 'response_complete' || newResponse.type === 'streaming_stopped') {
      setMessages(prev => {
        if (prev.length > 0) {
          return [{ ...prev[0], response_text: newResponse.response_text }, ...prev.slice(1)];
        } else {
          return [{ request_text: currentRequestText.current, response_text: newResponse.response_text }];
        }
      });
      setIsStreaming(false);
      responseBuffer.current = '';
      clearTimeout(updateTimeout.current);
      updateTimeout.current = null;
    } else if (newResponse.type === 'request_text') {
      setIsStreaming(true);
      setMessages(prev => [{ request_text: newResponse.request_text, response_text: '' }, ...prev]);
    }
  }, [newResponse]);

  // On WebSocket error
  useEffect(() => {
    if (socketError) {
      setIsStreaming(false);
      setError(socketError);
    }
  }, [socketError]);

  // Send message (new or existing conversation)
  const sendMessage = async (requestText) => {
    try {
      if (!token) {
        const conv = await CreateConversation(requestText);
        currentRequestText.current = requestText;
        firstMessageRef.current = requestText;
        setConversations(prev => [...prev, conv]);
        navigate(`/c/${conv.token}`);
      } else {
        setIsStreaming(true);
        currentRequestText.current = requestText;
        sendOverSocket({ request_text: requestText, type: 'start_streaming' });
      }
    } catch (err) {
      setError(err);
    }
  };

  // Send first message when socket is ready
  useEffect(() => {
    if (isConnected && firstMessageRef.current) {
      setIsStreaming(true);
      const msg = firstMessageRef.current;
      currentRequestText.current = msg;
      sendOverSocket({ request_text: msg, type: 'start_streaming' });
      firstMessageRef.current = null;
    }
  }, [isConnected]);

  // Initial or token change: load messages
  useEffect(() => {
    if (token) {
      loadMessages(1);
    } else {
      setMessages([]);
    }
  }, [token, loadMessages]);

  const loadMore = () => {
    if (hasMore && !loading) {
      loadMessages(page + 1);
      setPage(p => p + 1);
    }
  };

  const clearError = () => setError(null);

  return {
    messages,
    loading,
    error,
    sendMessage,
    hasMore,
    loadMore,
    isConnected,
    clearError,
    isLoadedMore,
    setIsLoadedMore,
    isStreaming,
    stopStreaming,
  };
}
