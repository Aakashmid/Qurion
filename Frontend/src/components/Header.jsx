import React from 'react'
import {  RiChatNewLine } from "react-icons/ri";
import { useSidebar } from '../context/SidebarContext';
import { IoMenu } from 'react-icons/io5';
import { TbMenu3 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { isSidebarOpen,toggleSidebarOpen } = useSidebar();
    const navigate = useNavigate();
    const handleCreateNewChat = () => {
        console.log('new chat created');
        navigate('/');
    }

    const isNewChat = () => {
        return location.pathname === '/'
    }

    return (
        <nav className='p-4  w-full  bg-gray-950  h-16 border-b-[0.5px] border-gray-800 '>
        {/* <nav className='p-4 fixed w-full top-0 bg-[#1E1E1E] z-10 '> */} 
            <div className="items-center justify-between lg:justify-normal lg:gap-5 h-full sm:flex hidden">
                <button className={`open-sidebar text-white hover:bg-gray-700 p-1 rounded-xl ${isSidebarOpen && 'lg:hidden'}`} onClick={toggleSidebarOpen}><TbMenu3 className='w-7 h-auto lg:w-8' /></button>

                <button className={`create-new-chat-btn text-white  p-1 rounded-xl ${isSidebarOpen && 'lg:hidden'}`} onClick={handleCreateNewChat}><RiChatNewLine  className='w-6 h-auto   ' /></button>
                <h2  className=" logo font-bold text-xl lg:text-2xl text-gray-300 ">Qurion</h2>

            </div>
            <div className="flex  items-center justify-between lg:justify-normal lg:gap-5 h-full sm:hidden">
                <button className={`open-sidebar text-white hover:bg-gray-700 p-1 rounded-xl ${isSidebarOpen && 'lg:hidden'}`} onClick={toggleSidebarOpen}><TbMenu3 className='w-7 h-auto lg:w-8' /></button>
                <h2 onClick={()=>navigate('/')} className="cursor-pointer logo font-bold text-xl lg:text-2xl text-gray-300">Qurion</h2>

                <button className='create-new-chat  text-gray-200 hover:bg-gray-700 p-1 rounded-xl' onClick={handleCreateNewChat}><RiChatNewLine  className='w-6 h-auto   ' /></button>

            </div>

        </nav>
    )
}
