
import React from 'react'
import { IoArrowBack, IoSearch, IoSearchCircle } from 'react-icons/io5'

export default function SidebarSearchInput({ ToggleShowSearch }) {
    return (

        <div className="w-full p-2 flex items-center lg:gap-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-600">
            <button onClick={ToggleShowSearch} className="rounded-full hover:bg-gray-500 p-1">
                <IoArrowBack size={'1.5rem'} />
            </button>
            <input
                type="text"
                placeholder="Search..."
                className=" text-lg w-full px-4 bg-gray-600 outline-none py-1 rounded-md  text-white "
            />
            <button className="scale-[120%] p-1 text-gray-200 hover:text-white">
                <IoSearch size={'1.3em'}/>
            </button>
        </div>

    )
}
