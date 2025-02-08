import React from 'react'
import { Menu , Add as AddIcon, Add } from '@mui/icons-material';
import useToggle from '../hooks/useToggle';
import Sidebar from './Sidebar';

export default function Header() {
    const [isSidebarOpen, toggleSidebarOpen] = useToggle(false);
    const handleCreateNewChat = () => {
        console.log("Create new chat");
    }
    return (
        <nav className='p-4 fixed w-full top-0 bg-gray-800 z-10 '>
            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 z-20 h-screen w-full lg:w-[33%] xl:w-[25%] `}>
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebarOpen={toggleSidebarOpen} />
            </div>
            <div className="flex items-center  gap-2 lg:gap-3">
                <button className='open-sidebar text-white hover:bg-gray-700 p-1 rounded-full' onClick={toggleSidebarOpen}><Menu /></button>
                <button className='create-new-chat text-white hover:bg-gray-700 p-1 rounded-full' onClick={handleCreateNewChat}><Add/></button>
                <h2 className="logo font-bold text-2xl text-gray-300">ChatGpt2.0</h2>
            </div>
        </nav>
    )
}
