import React from 'react'

export default function Sidebar() {
  return (
    <div className="w-full h-full bg-gray-800 text-white  ">
      <div className="p-4">
        <div className=" ">
          <ul className="space-y-2">
            <li className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200">Conversation 1</li>
          </ul>
        </div>
      </div>
    </div>
  )
}