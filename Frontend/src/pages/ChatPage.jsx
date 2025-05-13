import React, { use, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HomePageLayout from '../layout/HomePageLayout';
import MessageInput from '../components/MessageInput';
import { IoClose, IoReload } from 'react-icons/io5';
import useConversation from '../hooks/useConversation';
import Question from '../components/chat-page/Question';
import Response from '../components/chat-page/Response';

export default function ChatPage() {
  const { state } = useLocation();
  const { conversation_token } = useParams();
  const navigate = useNavigate();

  const {
    messages,
    loading,
    error,
    sendMessage,
    loadMore,
    clearError,
    isConnected,
    isWaiting
  } = useConversation(conversation_token);


  const scrollableRef = useRef(null);
  const bottomRef = useRef(null);
  const isFirstRender = useRef(null); // Track if it's the first render

  useEffect(() => {
    // Reset isFirstRender when conversation_token changes
    isFirstRender.current = true;
  }, [conversation_token]);



  useEffect(() => {
    if (bottomRef.current && !isFirstRender.current) {
      // Scroll to the bottom only after the first render
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (isFirstRender.current && messages.length > 0) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
      isFirstRender.current = false; // Mark as no longer the first render
    }

    console.log(messages);
  }, [messages]);

  return (
    <HomePageLayout>
      <div className="bg-gray-950 relative ">
        <div ref={scrollableRef}
          className="h-[calc(100vh-10rem)] overflow-y-auto p-4 scrollbar-light"
        >
          <div className="flex flex-col  chat-container  max-w-[48rem] mx-auto">

            {/* messages container */}
            <div className=" messages-container flex flex-col-reverse  ">
              {loading && <div>Loading…</div>}
              {messages.map((m, i) => (
                <div className='py-2' key={i}>
                  <Question text={m.request_text} />
                  {isWaiting && i === 0 &&
                    <div className="flex justify-start items-center py-2 px-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>                  }
                  <div className=""></div>
                  <Response text={m.response_text} />
                </div>
              ))}
              {/* Dummy div to scroll into view */}

            </div>

            {error && (
              <div className="w-full lg:w-1/2 mx-auto ">
                <div className="text-red-500 bg-gray-800 flex items-center border border-red-500 rounded-xl px-6 py-4 justify-between">
                  {/*  onclick reload make websocket connection again if it is close or just send message request question again */}
                  <IoReload className='h-5 w-auto' />
                  <p className="mx-4 text-[16px]">Something went wrong! please retry.</p>
                  <IoClose className='h-5 w-auto' onClick={() => clearError()} />
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>
        </div>

        <div className="w-full bg-gray-800 relative ">
          <MessageInput onSendMessage={sendMessage} />
        </div>
      </div>
    </HomePageLayout>
  );
}
