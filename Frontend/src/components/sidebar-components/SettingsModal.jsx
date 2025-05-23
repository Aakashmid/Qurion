import React, { useRef } from 'react'
import useClickOutside from '../../hooks/useClickOutside';
import { IoClose, IoTrash } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import EditField from '../settingsModalComponents/EditField';
import { LuLogOut, LuTrash2 } from 'react-icons/lu';

export default function SettingsModal({ onClose }) {
    const componentRef = useRef(null);
    const { user } = useSidebar();
    const navigate = useNavigate();
    useClickOutside(componentRef, () => {
        onClose();
    });



    return (
        <div ref={componentRef} className='bg-gray-900 rounded-xl shadow-xl w-full h-[90%]  max-w-xl   text-gray-300 overflow-hidden'>
            <div className='border-b border-gray-700  p-6 h-14 flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-gray-200'>Settings</h2>
                <button onClick={() => onClose()} className='text-gray-400 hover:text-gray-200'>
                    <IoClose className='w-6 h-auto' />
                </button>
            </div>
            <div className="flex flex-col gap-8 scrollbar-light  h-[calc(100%-3.5rem)] overflow-y-auto px-6 py-4">
                {/* 1. Account Info */}
                <section className="Account">
                    <h3 className="text font-semibold mb-2 text-purple">Account Info</h3>
                    <div className="flex flex-col gap-4">
                        <EditField title={"Avatar"} value={user?.username} />
                        <EditField title={"Name"} value={user?.name} />
                        <EditField title={"Email"} value={user?.email} />
                        <div className='sm:flex items-center sm:justify-between'>
                            <label className="block text-sm text-white font-semibold mb-1">Change Password</label>
                            <button className="bg-purple transition-colors hover:bg-violet-600 text-white px-3 py-1 rounded-lg mt-1">Change Password</button>
                        </div>
                    </div>
                </section>

                {/* 2. Interface Settings */}
                <section className="Interface">
                    <h3 className="text font-semibold mb-2 text-purple">Interface Settings</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm text-white font-semibold">Theme Mode</label>
                            <select className="bg-gray-800 text-sm   rounded-lg px-2 py-1 focus:outline-none text-white">
                                <option>Light</option>
                                <option>Dark</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm text-white font-semibold">Text Size</label>
                            <select className="bg-gray-800  text-sm  rounded-lg px-2 py-1 focus:outline-none text-white">
                                <option>Small</option>
                                <option>Medium</option>
                                <option>Large</option>
                            </select>
                        </div>

                    </div>
                </section>

                {/* 3. AI Behavior */}
                <section className="AIBehavior">
                    <h3 className="text font-semibold mb-2 text-purple">AI Behavior</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm text-white font-semibold">Default Tone</label>
                            <select className="bg-gray-800 rounded-lg  text-sm  focus:outline-none px-2 py-1 text-white">
                                <option>Formal</option>
                                <option>Casual</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm text-white font-semibold">Preferred Model</label>
                            <select className="bg-gray-800 rounded-lg  text-sm  focus:outline-none px-2 py-1 text-white">
                                <option>Default</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 4. Data Control */}
                <section className="DataControl">
                    <h3 className="text font-semibold mb-2 text-purple">Account Actions</h3>
                    <div className="flex flex-col gap-4 w-fit">
                        <div className="border border-gray-700 text-white px-4 py-1 rounded-lg flex gap-3 items-center hover:text-red-500 hover:border-red-500 transition-colors">
                            <LuLogOut/>
                            <button className="">Logout</button>
                        </div>
                        <div className="border border-gray-700 text-white px-4 py-1 rounded-lg flex gap-3 items-center hover:text-red-500 hover:border-red-500 transition-colors">
                            <LuTrash2/>
                        <button className="">Delete Account</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

