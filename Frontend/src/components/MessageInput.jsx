import React, { useState, useRef } from 'react'
import { IoAttach, IoSend } from 'react-icons/io5';
import { FaRegCircleStop } from "react-icons/fa6";

export default function MessageInput({ onSendMessage, stopStreaming, isStreaming }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea up to max height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'; // max 120px
    }
  };

  return (<div className='w-full   bg-gray-950 border-t-[0.5px] relative border-gray-800  flex justify-center items-center h-[6rem] '>
    <div className="absolute bottom-5 md:bottom-4 left-1/2 -translate-x-1/2 px-4 w-full">
      <form
        onSubmit={handleSubmit}

        className=" w-full bg-gray-800 rounded-3xl flex items-center focus-within:ring-1 focus-within:ring-purple py-2 px-3 max-w-[48rem] mx-auto transition-all overflow-y-auto max-h-[10rem]   scrollbar-dark "

      >
        <button type="button" className='attachments'>
          <IoAttach className='text-gray-400 hover:text-gray-200 rotate-45 w-6 h-auto' />
        </button>
        <textarea
          ref={textareaRef}
          autoFocus
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your request here…"
          className="w-full min-h-[2.5rem] md:min-h-[3rem]   px-2 bg-transparent text-gray-100 focus:outline-none caret-purple resize-none scrollbar-hide "
          rows={1}
        />
        {isStreaming ? (
          <button type='button' onClick={stopStreaming} className="p-1 text-gray-400 hover:text-gray-200">
            <FaRegCircleStop className='w-6 h-auto' />
          </button>
        ) : (
          <button type='submit' className="p-1 text-gray-400 hover:text-gray-200">
            <IoSend className='w-6 h-auto' />
          </button>
        )}
      </form>
    </div>
  </div >
  )
}