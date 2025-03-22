
import React, { useState } from 'react'
import { IoSend } from 'react-icons/io5';

export default function inputInput({ onSendMessage }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() != '') {
      // Handle input submission here
      onSendMessage(input);
      setInput('')
    }
  }

  return (
    <form className="relative w-full bg-gray-700 rounded-xl flex items-center focus-within:ring-2 focus-within:ring-gray-500 p-2">
      <input
      autoFocus
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' ? handleSubmit(e) : null}
        placeholder="Type a input..."
        className="w-full px-2 text-lg bg-transparent text-gray-100 focus:outline-none "
      />
      <button type="submit" className="p-1 text-gray-400 hover:text-gray-200">
        <IoSend className='w-8 h-auto' />
      </button>
    </form>
    )
}