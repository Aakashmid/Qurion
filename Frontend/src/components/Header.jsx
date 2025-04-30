import React from 'react'
import { RiChatNewLine } from "react-icons/ri";
import { useSidebar } from '../context/SidebarContext';
import { IoMenu } from 'react-icons/io5';
import { TbMenu3 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { PiDotsThree, PiDotsThreeVertical, PiDotsThreeVerticalBold, PiOption } from 'react-icons/pi';

export default function Header() {
    const { isSidebarOpen, toggleSidebarOpen } = useSidebar();
    const navigate = useNavigate();
    const handleCreateNewChat = () => {
        console.log('new chat created');
        navigate('/');
    }

    const isNewChat = () => {
        console.log("new chat is already create ")
        return location.pathname === '/'
    }

    return (


        <nav className='p-4  w-full  bg-gray-950  h-16 border-b-[0.5px] border-gray-800 '>
            {/* header for large screen  */}
            <div className="items-center justify-between md:justify-normal md:gap-5 h-full md:flex hidden">
                <button className={`open-sidebar text-gray-200 hover:text-white p-1 rounded-xl ${isSidebarOpen && 'md:hidden'}`} onClick={toggleSidebarOpen}><TbMenu3 className='w-7 h-auto lg:w-8' /></button>

                <button disabled={isNewChat} className={`create-new-chat-btn text-gray-200 hover:text-white p-1 rounded-xl ${isSidebarOpen && 'md:hidden'}`} onClick={()=>handleCreateNewChat}><RiChatNewLine className='w-6 h-auto' /></button>
                <h2 className=" logo font-bold text-xl lg:text-2xl text-gray-300 ">Qurion</h2>

            </div>


            {/* header for small screen  */}
            <div className="flex  items-center justify-between lg:justify-normal lg:gap-5 h-full md:hidden">
                <button  className={`open-sidebar text-gray-200 hover:text-white p-1 rounded-xl`} onClick={toggleSidebarOpen}><TbMenu3 className='w-7 h-auto lg:w-8' /></button>
                <h2  className="cursor-pointer logo font-bold text-xl lg:text-2xl text-gray-300">Qurion</h2>

                <div className="flex items-center gap-1">
                    <button disabled={isNewChat} className='create-new-chat text-gray-200 hover:text-white p-1 rounded-xl' onClick={handleCreateNewChat}><RiChatNewLine className='w-6 h-auto' /></button>
                    <button className='p-1 rounded-full hover:bg-gray-800'><PiDotsThreeVerticalBold className='text-gray-200 hover:text-white w-6 h-auto'/></button>
                </div>

            </div>

        </nav>
    )
}