import React, { useRef } from 'react'
import useClickOutside from '../../hooks/useClickOutside';
import { IoClose } from 'react-icons/io5';

export default function SettingsModal({ toggleShowSettings }) {
    const componentRef = useRef(null);
    useClickOutside(componentRef, () => {
        toggleShowSettings();
    });
    return (

        <div ref={componentRef} className=' bg-gray-900 rounded-lg shadow-xl w-[90%] max-w-xl p-6 text-gray-300'>
            <div className='border-b border-gray-700 pb-4 mb-4 flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-gray-200'>Settings</h2>
                <button onClick={toggleShowSettings} className='text-gray-400 hover:text-gray-200'>
                    <IoClose className='w-6 h-auto' />
                </button>
            </div>

            <div className='space-y-6'>
                {/* Profile Section */}
                <div>
                    <h3 className='text-lg font-medium text-gray-200 mb-3'>Profile</h3>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium mb-1'>Display Name</label>
                            <input type='text' className='w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium mb-1'>Bio</label>
                            <textarea className='w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' rows='3'></textarea>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div>
                    <h3 className='text-lg font-medium text-gray-200 mb-3'>Account Settings</h3>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium mb-1'>Email</label>
                            <input type='email' className='w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium mb-1'>Password</label>
                            <input type='password' className='w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                        <div className='flex items-center'>
                            <input type='checkbox' id='notifications' className='rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500' />
                            <label htmlFor='notifications' className='ml-2 text-sm'>Enable Notifications</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-6 flex justify-end space-x-3'>
                <button className='px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors'>Cancel</button>
                <button className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>Save Changes</button>
            </div>
        </div>
    )
}
