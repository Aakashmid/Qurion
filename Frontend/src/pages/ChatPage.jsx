import  {  useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HomePageLayout from '../layout/HomePageLayout';
import MessageInput from '../components/MessageInput';
import { IoArrowDown } from 'react-icons/io5';
import useConversation from '../hooks/useConversation';
import Question from '../components/chat-page/Question';
import Response from '../components/chat-page/Response';
import SomethinkWrongErr from '../components/chat-page/SomethinkWrongErr';

export default function ChatPage() {
  const { state } = useLocation();
  const { conversation_token } = useParams();
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const navigate = useNavigate();

  const {
    messages,
    setMessages,
    loading,
    error,
    sendMessage,
    loadMore,
    isLoadedMore,
    hasMore,
    clearError,
    isConnected,
    isStreaming,
    stopStreaming,
  } = useConversation(conversation_token);

  const scrollableRef = useRef(null);
  const prevScrollHeight = useRef(null);
  const bottomRef = useRef(null);
  const isFirstRender = useRef(true);
  const loadingMore = useRef(false);


  isFirstRender.current = true;


  useEffect(() => {
    const scrollToPosition = () => {
      if (loadingMore.current && prevScrollHeight.current && scrollableRef.current) {
        const newScrollHeight = scrollableRef.current.scrollHeight;
        const scrollPosition = newScrollHeight - prevScrollHeight.current;
        scrollableRef.current.scrollTop = scrollPosition;
        prevScrollHeight.current = null;
        loadingMore.current = false;
      } else if (!isLoadedMore && !isFirstRender.current && bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (isFirstRender.current && messages.length > 0 && scrollableRef.current) {
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        isFirstRender.current = false;
      }
    };

    const timeoutId = setTimeout(scrollToPosition, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);



  useEffect(() => {
    const element = scrollableRef.current;
    const handleScroll = () => {
      if (!element || !hasMore || loading || loadingMore.current || !conversation_token) {
        return;
      }
      const { scrollTop } = element;
      if (scrollTop < 100) {
        loadingMore.current = true;
        prevScrollHeight.current = element.scrollHeight;
        loadMore();
      }
    };

    if (!element || !conversation_token) return;

    element.addEventListener('scroll', handleScroll);
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loading, scrollableRef, conversation_token]);


  useEffect(() => {
    const element = scrollableRef.current;
    if (!element) return;

    const handleScrollButtonVisibility = () => {
      const { scrollHeight, scrollTop, clientHeight } = element;
      // Show button when we're more than 100px from the bottom
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };

    // Check initially
    handleScrollButtonVisibility();

    // Add event listener
    element.addEventListener('scroll', handleScrollButtonVisibility);
    return () => {
      element.removeEventListener('scroll', handleScrollButtonVisibility);
    };
  }, [scrollableRef]);



  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <HomePageLayout>
      <div className="bg-gray-950 relative ">
        <div
          ref={scrollableRef}
          className="h-[calc(100dvh-10rem)] overflow-y-auto p-4 scrollbar-light relative"
        >
          <div className="flex flex-col chat-container max-w-[48rem] mx-auto">
            <div className="messages-container flex flex-col-reverse">

              {/* instead show skelton  here  */}
              {loading && (
                <div className="flex justify-center items-center py-4 text-gray-400">
                  Loading…
                </div>
              )}
              <div ref={bottomRef}></div>
              {messages.length > 0 ? (
                messages.map((m, i) => (
                  <div className="py-2" key={i}>
                    <Question text={m.request_text} />
                    {isStreaming && i === 0 && (
                      <div className="flex justify-start items-center py-2 px-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <Response text={m.response_text} />
                  </div>
                ))
              ) : (
                !loading && (
                  <div className=" flex justify-center items-center text-2xl font-semibold text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                    How can I help you today?
                  </div>
                )
              )}
            </div>

            {error && (
              <div className="w-full sm:w-fit mx-auto">
                <SomethinkWrongErr clearError={clearError} />
              </div>
            )}


          </div>
        </div>

        <div className="w-full relative">

          <button
            onClick={scrollToBottom}
            className={` ${showScrollBtn ? 'block':'hidden'} bg-gray-900 rounded-full absolute z-10 -top-12  right-1/2 translate-x-1/2 p-2 cursor-pointer border border-gray-800 hover:bg-gray-800`}
          >
            <IoArrowDown className="h-6 w-6 text-white" />
          </button>

          <MessageInput
            onSendMessage={sendMessage}
            stopStreaming={stopStreaming}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </HomePageLayout>
  );
}