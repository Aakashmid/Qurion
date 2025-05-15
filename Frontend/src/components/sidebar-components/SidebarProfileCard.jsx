import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { LuLogOut } from "react-icons/lu";
import { RiAccountCircle2Line, RiSettings3Line } from 'react-icons/ri';
import useClickOutside from '../../hooks/useClickOutside';
import { useSidebar } from '../../context/SidebarContext';
import useToggle from '../../hooks/useToggle';
import SettingsModal from './SettingsModal';

export default function SidebarProfileCard() {
    const [isOpen, setIsOpen] = useState(false);
    const [showSettings, toggleShowSettings] = useToggle();
    const { user } = useSidebar();
    const popoverRef = useRef(null);

    const { logout } = useAuth();

    useClickOutside(popoverRef, () => setIsOpen(false));
    return (
        <div ref={popoverRef} className={`${isOpen ? 'bg-gray-800' : 'bg-gray-900'} sidebar-bottom  hover:bg-gray-800 transition-colors active:bg-gray-800 relative`}>
            {/* onclick profile open popover  */}

            {user ?
                <div className="profile-card h-[5rem] flex items-center gap-3 p-4 transition-all rounded-lg cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}>
                    {/* profile image */}
                    <div className="avatar w-8 h-8 rounded-full bg-purple flex items-center justify-center">
                        <span className="text-white font-medium">U</span>
                    </div>
                    <div className="user-info">
                        <h4 className="font-medium">{user.name ? user.name : user.username}</h4>
                        <p className="text-xs text-gray-300">{user.email ? user.email : user.username}</p>
                    </div>
                </div>
                :
                <div className="profile-card-skeleton h-[5rem] flex items-center gap-3 p-4 transition-all rounded-lg cursor-pointer">
                    <div className="avatar w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
                    <div className="user-info flex flex-col gap-2">
                        <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-3 w-32 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                </div>
            }

            {/* Popover Menu */}
            {isOpen && (
                <div className="absolute bottom-full left-4 w-48 mb-2 bg-gray-800 rounded-lg shadow-lg py-2">
                    <button onClick={toggleShowSettings}  className="w-full px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-5">
                        <RiSettings3Line className='h-5 w-auto' />
                        <span>Settings</span>
                    </button>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button onClick={() => logout()} className="w-full px-4 py-2 hover:bg-gray-700 cursor-pointer  flex items-center gap-5">
                        <LuLogOut className='text-red-400 h-5 w-auto' />
                        <span>Logout</span>
                    </button>
                </div>
            )}

            {showSettings &&
                <div className="fixed top-0 left-0 w-screen h-screen z-30 bg-black bg-opacity-50 flex items-center justify-center px-10">
                    <SettingsModal toggleShowSettings={toggleShowSettings} />
                </div>
            }
        </div>
    )
}