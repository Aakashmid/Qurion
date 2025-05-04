// src/hooks/useConversation.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { CreateConversation, fetchConversationMessages } from '../services/apiServices';
import useSocket from './useSocket';

export default function useConversation(initialToken) {
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isConnected, newResponse, sendOverSocket, socketError] =
    useSocket(token, import.meta.env.VITE_WS_CONVERSATION_URL);

  const responseBuffer = useRef(''); // Buffer to accumulate response chunks
  const updateTimeout = useRef(null); // Timeout for debouncing updates

  useEffect(() => {
    setToken(initialToken);
  }, [initialToken]);

  // Fetch a page of messages
  const loadMessages = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const data = await fetchConversationMessages(token, pageNum);
      setMessages(prev => (pageNum === 1 ? data.results : [...prev, ...data.results]));
      setHasMore(!!data.next);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Handle real-time updates with debouncing
  useEffect(() => {
    if (newResponse) {
      if (newResponse.type === 'response_chunk') {
        responseBuffer.current += newResponse.response_text; // Accumulate chunks

        // Debounce updates to the UI
        if (!updateTimeout.current) {
          updateTimeout.current = setTimeout(() => {
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].response_text += responseBuffer.current;
              responseBuffer.current = ''; // Clear the buffer
              return updated;
            });
            updateTimeout.current = null; // Clear the timeout
          }, 100); // Update every 100ms
        }
      } else if (newResponse.type === 'response_complete') {
        // Finalize the response
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].response_text = newResponse.response_text;
          return updated;
        });
        responseBuffer.current = ''; // Clear the buffer
        clearTimeout(updateTimeout.current); // Clear any pending updates
        updateTimeout.current = null;
      }
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
      setError(err);
    }
  };

  // Infinite scroll loader
  const loadMore = () => {
    if (hasMore && !loading) {
      loadMessages(page + 1);
      setPage(p => p + 1);
    }
  };

  // On token change or first load
  useEffect(() => {
    if (token) {
      loadMessages(1);
    } else {
      setMessages([]);
    }
  }, [token]);

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
