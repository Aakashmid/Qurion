import React from 'react'
import { PiNotePencilDuotone } from "react-icons/pi";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { useSidebar } from '../context/SidebarContext';
import { IoMenu } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { toggleSidebarOpen } = useSidebar();
    const navigate = useNavigate();
    const handleCreateNewChat = () => {
        console.log('new chat created');
        navigate('/');
    }

    const isNewChat = () => {
        return location.pathname === '/'
    }
    return (
        <nav className='p-4 fixed w-full top-0 bg-gray-800 z-10 '>
            <div className="flex  items-center justify-between lg:justify-normal lg:gap-5">
                <button className='open-sidebar text-white hover:bg-gray-700 p-1 rounded-xl' onClick={toggleSidebarOpen}><IoMenu className='w-7 h-auto lg:w-8' /></button>
                <h2 className="logo font-bold text-xl lg:text-2xl text-gray-300">Proxima</h2>
                <button className='create-new-chat  text-gray-200 hover:bg-gray-700 p-1 rounded-xl' onClick={handleCreateNewChat}><PiNotePencilDuotone className='w-7 h-auto ' /></button>

            </div>
        </nav>
    )
}
