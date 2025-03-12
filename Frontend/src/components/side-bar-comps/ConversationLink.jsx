import React, { useState } from 'react'
import { PiDotsThree } from 'react-icons/pi';

export default function ConversationLink({ conversation, onClickLink, selectedConversation }) {
    const [showOptionIcon, setShowOptionIcon] = useState(false);
    const [showActions, setShowActions] = useState(false);


    const handleRename = async () => {

    }

    return (
        <li onMouseEnter={() => setShowOptionIcon(true)}
            onMouseLeave={() => setShowOptionIcon(false)}
            className={`px-2 relative flex  items-center   rounded-lg cursor-pointer transition-all ${conversation.id === selectedConversation ? 'bg-gray-600' : 'hover:bg-gray-600'}`} >

            <p className="px-2 overflow-hidden grow  py-[0.4rem]" onClick ={()=>onClickLink(conversation)}>
                {conversation.name}
            </p>
            {
                showOptionIcon && (
                    <span className="p-[0.09rem] hover:bg-gray-500 rounded-full" onClick={() => setShowActions(!showActions)}><PiDotsThree className='w-6 h-auto' /></span>
                )
            }
            {
                showActions && (
                    <div onMouseLeave={()=>setShowActions(false)}  className="absolute top-2 right-0 mt-8 bg-slate-800 rounded-xl  z-10 overflow-hidden">
                        <ul>
                            <li className="px-4  hover:bg-gray-800/80  py-1 hover:text-white text-gray-300 cursor-pointer ">Rename</li>
                            <li className="bg-gray-700 w-full h-[1px]"></li>
                            <li className="px-4  hover:bg-gray-800/80  py-1 text-red-400 hover:text-red-500 cursor-pointer">Delete</li>
                        </ul>
                    </div>
                )
            }

        </li>
    )
}
