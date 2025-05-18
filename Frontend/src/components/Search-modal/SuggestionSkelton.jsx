import React from 'react'

export default function SuggestionSkelton() {
    return (
        <li className="flex justify-between items-center px-4 py-2 rounded-lg animate-pulse bg-gray-700 ">
            <span className="h-4 w-32 bg-gray-500 rounded"></span>
            <span className="h-3 w-12 bg-gray-500 rounded ml-4"></span>
        </li>
    )

}
