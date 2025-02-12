import React from 'react'
import { Menu , Add as AddIcon, Add } from '@mui/icons-material';
import { useSidebar } from '../context/SidebarContext';

export default function Header() {
    const {toggleSidebarOpen} = useSidebar();

    const handleCreateNewChat = () => {
        console.log("Create new chat");
    }
    return (
        <nav className='p-4 fixed w-full top-0 bg-gray-800 z-10 '>
            <div className="flex items-center  gap-2 lg:gap-3">
                <button className='open-sidebar text-white hover:bg-gray-700 p-1 rounded-full' onClick={toggleSidebarOpen}><Menu /></button>
                <button className='create-new-chat text-white hover:bg-gray-700 p-1 rounded-full' onClick={handleCreateNewChat}><Add/></button>
                <h2 className="logo font-bold text-2xl text-gray-300">ChatGpt2.0</h2>
            </div>
        </nav>
    )
}
