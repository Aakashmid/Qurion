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
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false); // this is for waiting for response from socket
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
    try {
      setLoading(true);
      const data = await fetchConversationMessages(token, pageNum);
      setMessages(prev =>
        pageNum === 1 ? data.results : [...prev, ...data.results]
      );
      setHasMore(!!data.next);
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
            const updated = [...prev];
            if (updated.length > 0) {
              updated[0].response_text += responseBuffer.current;
            } else {
              console.log('No messages to update');
              updated.push({
                request_text: currentRequestText.current,
                response_text: responseBuffer.current,
              });
            }
            responseBuffer.current = '';
            return updated;
          });
          updateTimeout.current = null;
        }, 100);
      }

    } else if (newResponse.type === 'response_complete') {
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[0].response_text = newResponse.response_text;
        } else {
          console.log('No messages to update');
          updated.push({
            request_text: currentRequestText.current,
            response_text: newResponse.response_text,
          });
        }
        return updated;
      });
      setIsStreaming(false);
      responseBuffer.current = '';
      clearTimeout(updateTimeout.current);
      updateTimeout.current = null;
    }
    else if (newResponse.type === 'streaming_stopped') {
      console.log('streaming stopped')
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[0].response_text = newResponse.response_text;
        } else {
          updated.push({
            request_text: currentRequestText.current,
            response_text: newResponse.response_text,
          });
        }
        return updated;
      });
      setIsStreaming(false);
      responseBuffer.current = '';
      clearTimeout(updateTimeout.current);
      updateTimeout.current = null;
    }

  }, [newResponse]);

  // On WebSocket error
  useEffect(() => {
    if (socketError) {
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
        setMessages(prev => [{ request_text: requestText, response_text: '' }, ...prev]);
        sendOverSocket({ request_text: requestText });
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
      setMessages([{ request_text: msg, response_text: '' }]);
      sendOverSocket({ request_text: msg });
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
  }, [token]);

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
    loadMore,
    isConnected,
    clearError,
    isStreaming,
    stopStreaming,
  };
}
