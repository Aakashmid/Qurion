
import React from 'react'
import { IoArrowBack, IoSearch, IoSearchCircle } from 'react-icons/io5'

export default function SidebarSearchInput({ ToggleShowSearch }) {
// const {setConversation}
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    }

    return (
        <div className="w-full py-2 px-2 flex items-center rounded-2xl  focus-within:ring-1 focus-within:ring-purple  bg-gray-800">
            <button onClick={ToggleShowSearch} className="rounded-full text-gray-200 hover:text-white p-1">
                <IoArrowBack className='w-5 lg:w-6 h-auto' />
            </button>
            <input
                value={searchQuery}
                onChange={handleChange}
                type="text"
                placeholder="Search..."
                className="  focus:outline-none caret-purple lg:text-lg w-full px-2 lg:px-4  bg-gray-800 outline-none py-1 rounded-md  text-white "
            />
            <button className="p-1 text-gray-200 hover:text-white">
                <IoSearch className='w-6 h-auto' />
            </button>
        </div>

    )
}
