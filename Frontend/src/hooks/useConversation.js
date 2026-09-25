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
      // console.log(!!data.next)
      if (!data.results || data.results.length === 0) {
        setHasMore(false);
      } 
      else{
        setHasMore(!!data.next);
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

// ------------------------------------- 
// handle real-time streaming of responses
const revealQueue = useRef('');
const revealInterval = useRef(null);
useEffect(() => {
  if (!newResponse) return;
  
  if (newResponse.type === 'response_chunk') {
    // Feed the reveal queue directly — no need for the 100ms network batching anymore,
    // the reveal interval below is what paces the visible typing now.
    revealQueue.current += newResponse.response_text;
    
    if (!revealInterval.current) {
      revealInterval.current = setInterval(() => {
        if (revealQueue.current.length === 0) return;
        
        // Reveal a few characters per tick — tune this for typing feel
        const CHARS_PER_TICK = 3;
        const next = revealQueue.current.slice(0, CHARS_PER_TICK);
        revealQueue.current = revealQueue.current.slice(CHARS_PER_TICK);
        
        setMessages(prev => {
          if (prev.length > 0) {
            return [{ ...prev[0], response_text: prev[0].response_text + next }, ...prev.slice(1)];
          }
          return [{ request_text: currentRequestText.current, response_text: next }];
        });
      }, 15); // ms per tick — lower = faster typing, higher = slower
    }
    
  } else if (newResponse.type === 'response_complete' || newResponse.type === 'streaming_stopped') {
    // Full text already known — flush remaining queue instantly, don't make the user
    // wait for the reveal interval to finish draining a long backlog.
    clearInterval(revealInterval.current);
    revealInterval.current = null;
    revealQueue.current = '';
    
    setMessages(prev => {
      if (prev.length > 0) {
        return [{ ...prev[0], response_text: newResponse.response_text }, ...prev.slice(1)];
      }
      return [{ request_text: currentRequestText.current, response_text: newResponse.response_text }];
    });
    setIsStreaming(false);
    
  } else if (newResponse.type === 'request_text') {
    setIsStreaming(true);
    setMessages(prev => [{ request_text: newResponse.request_text, response_text: '' }, ...prev]);
  }
}, [newResponse]);

// ------------------------------------- 



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
      setPage(1);
      loadMessages(1);
    } else {
      setMessages([]);
      setError(null);
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
    setMessages,
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
