
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
    <form onSubmit={handleSubmit} className="flex items-center gap-4 p-1 border border-gray-700 bg-gray-800 rounded-xl">
      <div className="relative w-full bg-gray-700 rounded-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' ? handleSubmit(e) : null}
          placeholder="Type a input..."
          className="w-full px-4 py-3 text-lg bg-transparent text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 pr-10"
        />
        <button type="submit" className="absolute  right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200">
          <IoSend size={'1.4rem'} />
        </button>
      </div>
    </form>)
}