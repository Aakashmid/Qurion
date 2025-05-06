import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function SidebarProfileCard() {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);

    const {logout} = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    return (
        <div ref={popoverRef} className={`${isOpen ? 'bg-gray-800' :'bg-gray-900'} sidebar-bottom  hover:bg-gray-800 transition-colors active:bg-gray-800 relative`}>
            {/* onclick profile open popover  */}
            <div className="profile-card h-[5rem] flex items-center gap-3 p-4 transition-all rounded-lg cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}>
                {/* profile image */}
                <div className="avatar w-8 h-8 rounded-full bg-purple flex items-center justify-center">
                    <span className="text-white font-medium">U</span>
                </div>
                <div className="user-info">
                    <h4 className="font-medium">User Name</h4>
                    <p className="text-xs text-gray-300">user@example.com</p>
                </div>
            </div>

            {/* Popover Menu */}
            {isOpen && (
                <div  className="absolute bottom-full left-4 w-48 mb-2 bg-gray-800 rounded-lg shadow-lg py-2">
                    <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <span>Profile Settings</span>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        <span>Account Settings</span>
                    </div>
                    <div className="border-t border-gray-700 my-1"></div>
                    <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-400">
                        <span onClick={()=>logout()} >Logout</span>
                    </div>
                </div>
            )}
        </div>
    )
}