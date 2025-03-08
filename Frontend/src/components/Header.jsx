import React from 'react'
import { PiNotePencil } from "react-icons/pi";
import { useSidebar } from '../context/SidebarContext';
import { IoMenu } from 'react-icons/io5';

export default function Header() {
    const { toggleSidebarOpen } = useSidebar();

    const handleCreateNewChat = () => {
        console.log("Create new chat");
    }
    return (
        <nav className='p-4 fixed w-full top-0 bg-gray-800 z-10 '>
            <div className="flex  items-center justify-between lg:gap-3">
                <button className='open-sidebar text-white hover:bg-gray-700 p-1 rounded-xl' onClick={toggleSidebarOpen}><IoMenu size={'1.5rem'}/></button>
                <h2 className="logo font-bold text-2xl text-gray-300">ChatGpt2.0</h2>
                <button className='create-new-chat  text-gray-200 hover:bg-gray-700 p-1 rounded-xl' onClick={handleCreateNewChat}><PiNotePencil size={'1.5rem'}/></button>
            </div>
        </nav>
    )
}
