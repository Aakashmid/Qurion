import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HomePageLayout from '../layout/HomePageLayout';
import MessageInput from '../components/MessageInput';
import { Question, Response } from '../components/chat-page/SmallComponents';
import { IoClose, IoReload } from 'react-icons/io5';
import { HiArrowDown } from 'react-icons/hi2';
import useConversation from '../hooks/useConversation';

export default function ChatPage() {
  const { first_question } = useLocation().state || {};
  const { conversation_token } = useParams();
  const navigate = useNavigate();

  const {
    messages,
    loading,
    error,
    sendMessage,
    loadMore,
    clearError,
  } = useConversation(conversation_token);

  const bottomRef = useRef(null);
  
  useEffect(() => {
    if (first_question?.trim()) sendMessage(first_question);
  }, [first_question]);


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  return (
    <HomePageLayout>
      <div className="bg-gray-950 relative ">
        <div
          className="h-[calc(100vh-10rem)] overflow-y-auto p-4 dark-scrollbar-custom "
          onScroll={e => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            if (scrollTop + clientHeight >= scrollHeight - 50) loadMore();
          }}
        >
          <div className="chat-container max-w-[48rem] mx-auto text-sm flex flex-col  ">
            {loading && <div>Loading…</div>}
            {messages.map((m, i) => (
              <div className='py-2' key={i}>
                <Question text={m.request_text} />
                <Response text={m.response_text} />
              </div>
            ))}
            {/* Dummy div to scroll into view */}
            <div ref={bottomRef}></div>
          </div>
        </div>

        {error && (
          <div className="absolute bottom-24 w-full lg:w-1/2 mx-auto px-5">
            <div className="text-red-500 bg-gray-800 flex items-center border border-red-500 rounded-xl px-6 py-2">
              <IoReload />
              <p className="mx-4">Something went wrong; please retry.</p>
              <IoClose onClick={() =>clearError()} />
            </div>
          </div>
        )}

        <div className="w-full bg-gray-800 relative ">
          <MessageInput onSendMessage={sendMessage} />
        </div>
      </div>
    </HomePageLayout>
  );
}
