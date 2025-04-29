import React from 'react'
import SidebarSearchInput from '../SidebarSearchInput'
import useToggle from '../../hooks/useToggle';
import { IoClose, IoMenu, IoSearch } from 'react-icons/io5';
import { useSidebar } from '../../context/SidebarContext';
import { TbMenu3 } from 'react-icons/tb';

export default function SidebarTop() {
    const { isSidebarOpen,toggleSidebarOpen } = useSidebar();
    const [showSearch, ToggleShowSearch] = useToggle(false);
    return (
        <div className="p-4 flex item-center justify-between sidebar-top bg-gray-900 border-b border-gray-800 h-16">
            <button className={`open-sidebar text-white hover:bg-gray-800  rounded-xl `} onClick={toggleSidebarOpen}><TbMenu3 className='w-7 lg:w-8 h-auto' /></button>
            {/* <button className='open-sidebar text-white hover:bg-gray-800  rounded-xl' onClick={toggleSidebarOpen}><IoClose className='w-7 lg:w-8 h-auto' /></button> */}

            <h2 className={`cursor-pointer logo font-bold text-xl lg:text-2xl text-gray-300 ${isSidebarOpen && 'lg:hidden'}`}>Qurion</h2>
            <button className='search-icon text-white hover:text-gray-300  rounded-xl' onClick={ToggleShowSearch}><IoSearch className='w-7  h-auto' /></button>
            {showSearch && (
                <div className="absolute top-0 left-0 w-full p-2 ">
                    <SidebarSearchInput ToggleShowSearch={ToggleShowSearch} />
                </div>
            )}
        </div>
    )
}
