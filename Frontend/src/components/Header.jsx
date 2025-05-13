import React, { useEffect, useRef, useState } from 'react'
import { RiChatNewLine } from "react-icons/ri";
import { useSidebar } from '../context/SidebarContext';
import { TbMenu3 } from "react-icons/tb";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PiDotsThreeVerticalBold, PiTrash, PiTrashDuotone } from 'react-icons/pi';
import { DeleteConversation } from '../services/apiServices';
import { IoShareSocialOutline } from 'react-icons/io5';
import { LuTrash2 } from 'react-icons/lu';
import { BsShare } from "react-icons/bs";
import useClickOutside from '../hooks/useClickOutside';
import useToggle from '../hooks/useToggle';
import ShareModal from './header-components/ShareModal';

export default function Header() {
    const { isSidebarOpen, toggleSidebarOpen } = useSidebar();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showShareModal, toggleShareModal] = useToggle();
    const { conversation_token: conv_token } = useParams();
    const { setConversations } = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();
    const {conversation_token} = useParams();

    const menuRef = useRef();

    // Use the custom hook to close the menu on outside click
    useClickOutside(menuRef, () => setIsMenuOpen(false));

    const handleCreateNewChat = () => {
        console.log('new chat created');
        navigate('/');
    }

    const handleDelete = async () => {
        try {
            const data = await DeleteConversation(conv_token);
            setConversations((prevConvs) => prevConvs.filter((con) => con.token !== conv_token));
            navigate('/');

        } catch (error) {
            console.error(error);
        }
    }

    const handleShare = () => {
        toggleShareModal();
        setIsMenuOpen(false);
    }
    const isNewChat = location.pathname === '/';

    return (

        <nav ref={menuRef} className=' p-4   w-full  bg-gray-950  h-16 border-b-[0.5px] border-gray-800 relative '>
            {/* header for large screen  */}
            <div className="items-center justify-between   h-full md:flex hidden">
                <div className="flex justify-between items-center md:justify-normal gap-5">
                    <button className={`open-sidebar text-gray-200 hover:text-white p-1 rounded-xl ${isSidebarOpen && 'md:hidden'}`} onClick={toggleSidebarOpen}><TbMenu3 className='w-7 h-auto lg:w-8' /></button>

                    <button disabled={isNewChat} className={`create-new-chat-btn text-gray-200 hover:text-white p-1 rounded-xl ${isSidebarOpen && 'md:hidden'}`} onClick={() => handleCreateNewChat()}><RiChatNewLine className='w-6 h-auto' /></button>
                    <h2 className=" logo font-bold text-xl lg:text-2xl text-gray-300 ">Qurion</h2>
                </div>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='p-1 rounded-full hover:bg-gray-800'><PiDotsThreeVerticalBold className='text-gray-200 hover:text-white w-6 h-auto' /></button>
            </div>


            {/* header for small screen  */}
            <div className="flex  items-center justify-between lg:justify-normal lg:gap-5 h-full md:hidden">
                <button className={`open-sidebar text-gray-200 hover:text-white p-1 rounded-xl`} onClick={toggleSidebarOpen}><TbMenu3 className='w-7 h-auto lg:w-8' /></button>
                <h2 className="cursor-pointer logo font-bold text-xl lg:text-2xl text-gray-300">Qurion</h2>
                <div className="flex items-center gap-1">
                    <button disabled={isNewChat} className='create-new-chat text-gray-200 hover:text-white p-1 rounded-xl' onClick={handleCreateNewChat}><RiChatNewLine className='w-6 h-auto' /></button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='p-1 rounded-full hover:bg-gray-800'><PiDotsThreeVerticalBold className='text-gray-200 hover:text-white w-6 h-auto' /></button>
                </div>
            </div>

            {isMenuOpen && conv_token &&
                <div className="rounded-xl absolute  top-14 right-8 bg-gray-900 border-gray-800 border p-2 max-w-fit z-10">
                    <ul className='flex-col space-y-2 '>
                        <li>
                            <button onClick={handleShare} className="w-full text-sm text-left px-3 py-2 text-gray-200 hover:bg-gray-800 rounded-lg flex items-center gap-4">
                                <BsShare className=' h-4 w-auto' />
                                Share Link
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleDelete()} className="w-full text-sm text-left px-3 py-2  hover:bg-gray-800 rounded-lg flex items-center gap-4 text-gray-200">
                                <LuTrash2 className='h-4 w-auto text-red-500' />
                                Delete Chat
                            </button>
                        </li>
                    </ul>
                </div>
            }

            {showShareModal && conversation_token && 
                <div className="fixed inset-0 h-[100vh]  flex items-center justify-center z-30">
                    <span onClick={()=>toggleShareModal()} className="w-full h-full fixed bg-black/50"></span>
                    <div className="z-40 w-full max-w-md">
                        <ShareModal toggleShareModal={toggleShareModal} conv_token={conversation_token}/>
                    </div>
                </div>
            }
        </nav>
    )
}