
import React, { useState } from 'react'
import { IoAttach, IoSend } from 'react-icons/io5';
import { FaRegCircleStop } from "react-icons/fa6";

export default function MessageInput({ onSendMessage, stopStreaming , isStreaming }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() != '') {
      //  Handle input submission here
      onSendMessage(input);
      setInput('')
    }
  }

  return (<div className='w-full   bg-gray-950 border-t-[0.5px] border-gray-800  flex justify-center items-center px-4 h-[6rem] '>
    <form onSubmit={(e)=>handleSubmit(e)} className="relative w-full bg-gray-800 rounded-3xl flex items-center focus-within:ring-1  focus-within:ring-purple py-2 px-3 max-w-[48rem] mx-auto">
      <button className='attachments'>
        <IoAttach className='text-gray-400 hover:text-gray-200 rotate-45  w-6 h-auto ' />
      </button>
      <input
        autoFocus
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}

        onKeyDown={(e) => e.key === 'Enter' ? handleSubmit(e) : null}
        placeholder="Type a input..."
        className="w-full px-2   bg-transparent text-gray-100 focus:outline-none caret-purple"
      />

      {isStreaming ? (
        <button type='button' onClick={()=>stopStreaming()} className="p-1 text-gray-400 hover:text-gray-200">
          <FaRegCircleStop className='w-6 h-auto' />
        </button>
      ) : (
        <button type='submit' className="p-1 text-gray-400 hover:text-gray-200">
          <IoSend className='w-6 h-auto' />
        </button>
      )}
    </form>
  </div >
  )
}