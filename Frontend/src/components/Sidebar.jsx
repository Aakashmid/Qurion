import { ArrowBack, Book, Lens, LensRounded, Menu, Search, SearchRounded } from '@mui/icons-material'
import React from 'react'
import useToggle from '../hooks/useToggle'
import SidebarSearchInput from './SidebarSearchInput';

export default function Sidebar({ toggleSidebarOpen }) {
  const [showSearch, ToggleShowSearch] = useToggle(false);
  return (
    <div className="w-full h-full bg-gray-700 text-white  ">
      <div className="p-4">
        {/* <h1 className="text-2xl font-bold mb-2 px-4">Logo</h1> */}
        <div className="flex item-center justify-between sidebar-top">
          <button className='open-sidebar text-white hover:bg-gray-800 p-1 rounded-full' onClick={toggleSidebarOpen}><Menu /></button>
          <div className="flex items-center gap-2 ">
            <button className='create-new-chat text-white '><Book /></button>
            <button className='search-icon text-white ' onClick={ToggleShowSearch}><Search /></button>
          </div>
          {showSearch && (
            <SidebarSearchInput ToggleShowSearch={ToggleShowSearch} />
          )}
        </div>
        <h3 className="text-lg font-medium px-4  py-2 mt-4"> Conversations</h3>
        <hr className='my-2' />
        <div className=" ">
          <ul className="space-y-2">
            {[1, 2, 3, 4, 5, 7, 6, 8, 9, 10].map((item, index) => (
              <li key={index} className="px-4 py-2 hover:bg-gray-600 rounded-md cursor-pointer transition-colors duration-200">Conversation {index + 1}</li>
            ))}
            <li className="px-4 py-2 hover:bg-gray-600 rounded-md cursor-pointer transition-colors duration-200">Conversation 1</li>
          </ul>
        </div>
      </div>
    </div>
  )
}