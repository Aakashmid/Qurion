import { ArrowBack, SearchRounded } from '@mui/icons-material'
import React from 'react'

export default function SidebarSearchInput({ToggleShowSearch}) {
    return (
        <div className="p-2 absolute  left-0 top-0  w-full">
            <div className="w-full p-1 flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-600">
                <button onClick={ToggleShowSearch} className="rounded-full hover:bg-gray-600 p-1">
                    <ArrowBack />
                </button>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 bg-gray-600 outline-none py-2 rounded-md  text-white "
                />
                <button className="p-1 text-gray-500 hover:text-gray-300">
                    <SearchRounded />
                </button>
            </div>
        </div>
    )
}
