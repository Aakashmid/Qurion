import React, { useRef } from 'react'
import useClickOutside from '../../hooks/useClickOutside';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';

export default function SettingsModal({ onClose }) {
    const componentRef = useRef(null);
    const {user} =  useSidebar();
    const navigate = useNavigate();
    useClickOutside(componentRef, () => {
        onClose();
    });

    
    return (

        <div ref={componentRef} className=' bg-gray-900 rounded-lg shadow-xl   w-full h-[90%] max-w-xl p-6 text-gray-300'>
            <div className='border-b border-gray-700 pb-4 mb-4 flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-gray-200'>Settings</h2>
                <button onClick={()=>onClose()} className='text-gray-400 hover:text-gray-200'>
                    <IoClose className='w-6 h-auto' />
                </button>
            </div>
            <div className="">
                <section className="Account">
                    <h3 className="text font-semibold mb-2">Account</h3>
                    <div className="flex flex-col gap-2">
                        <div className="username">

                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
