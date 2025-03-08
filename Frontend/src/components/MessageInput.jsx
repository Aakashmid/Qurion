
import React, { useState } from 'react'
import { IoSend } from 'react-icons/io5';

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      // Handle message submission here
      onSendMessage(message);
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 p-1 border border-gray-700 bg-gray-800 rounded-xl">
      <div className="relative w-full bg-gray-700 rounded-lg">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full px-4 py-3 text-lg bg-transparent text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 pr-10"
        />
        <button type="submit" className="absolute  right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200">
          <IoSend size={'1.4rem'} />
        </button>
      </div>    </form>)
}