import React, { useEffect, useState } from 'react'
import { PiDotsThree } from 'react-icons/pi';
import { DeleteConversation, UpdateConversation } from '../../services/apiServices';

export default function ConversationLink({ conversation, onClickLink, selectedConversation, setConversations }) {
    const [showOptionIcon, setShowOptionIcon] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [conversationName, setConversationName] = useState(conversation.name);
    const [formInput, setFormInput] = useState(conversation.name);


    const handleRename = async () => {
        try {
            if (formInput.trim() !== '') {
                const data = await UpdateConversation(conversation.token, formInput);

                if (data) {

                    //  when conversation is not fetching all time use this to change state
                    // setConversations((prevConvs)=> prevConvs.map((con) => {
                    //     if (con.id === conversation.id) {
                    //         return {
                    //             ...con,
                    //             name: formInput
                    //         }
                    //     }
                    //     return con;
                    // }));
                    console.log(data);
                    setConversationName(formInput);
                }
            }
        } catch (error) {
            console.error(error);
        }
        setShowRenameModal(false);

    }


    const handleDelete = async () => {
        try {
            const data = await DeleteConversation(conversation.token);
            // if (data) {
            //     // setConversations((prevConvs) => prevConvs.filter((con) => con.id !== conversation.id));
            //     onClickLink(conversation);
            // }
            setConversations((prevConvs) => prevConvs.filter((con) => con.id !== conversation.id));
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            const renameInput = document.querySelector('.rename-input');
            if (renameInput && !renameInput.contains(event.target)) {
                setShowRenameModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [])


    return <>
        {!showRenameModal ? <li onMouseEnter={() => setShowOptionIcon(true)}
            onMouseLeave={() => setShowOptionIcon(false)}
            className={`px-2 relative flex  items-center   rounded-lg cursor-pointer transition-all  ${conversation.id === selectedConversation ? 'bg-gray-600' : 'hover:bg-gray-600'}`} >

            <p className="px-2 overflow-hidden grow  py-[0.4rem]" onClick={() => onClickLink(conversation)}>
                {conversationName}
                {/* {conversation.name} */}
            </p>
            {
                showOptionIcon && (
                    <span className="p-[0.09rem] hover:bg-gray-500 rounded-full" onClick={() => setShowActions(!showActions)}><PiDotsThree className='w-6 h-auto' /></span>
                )
            }
            {
                showActions && (
                    <div onMouseLeave={() => setShowActions(false)} className="absolute top-2 right-0 mt-8 bg-slate-800 rounded-xl  z-10 overflow-hidden">
                        <ul>
                            <li onClick={() => { setShowRenameModal(true); setShowActions(false) }} className="px-4  hover:bg-gray-800/80  py-1 hover:text-white text-gray-300 cursor-pointer ">Rename</li>
                            <li className="bg-gray-700 w-full h-[1px]"></li>
                            <li onClick={() => setIsConfirmModal(true)} s className="px-4  hover:bg-gray-800/80  py-1 text-red-400 hover:text-red-500 cursor-pointer">Delete</li>
                        </ul>
                    </div>
                )
            }

        </li>
            :
            // rename conversation form
            <div className="relative transition-all ">
                <div className="w-full rename-input px-1 z-20 focus-within:ring-2 focus-within:ring-gray-500 rounded-xl bg-gray-900 overflow-hidden flex items-center ">
                    <input
                        autoFocus
                        onKeyDown={(e) => { e.key === 'Enter' ? handleRename(e) : null }}
                        type="text"
                        className=" flex-grow px-2 py-[0.4rem]  bg-gray-900 outline-none cursor-text"
                        placeholder={formInput}
                        value={formInput}
                        onChange={(e) => setFormInput(e.target.value)}
                    />
                    <button onClick={() => setShowRenameModal(false)} className="mr-2  hover:bg-gray-600 rounded-xl py-1 px-2 transition-all text-sm">
                        Cancel
                    </button>
                    <button onClick={() => handleRename()} className="py-1 px-2  rounded-xl bg-blue-600 active:bg-blue-700  transition-all  text-sm ">
                        Rename
                    </button>
                </div>
            </div>}

        {isConfirmModal &&
            <div onClick={() => setIsConfirmModal(false)} className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 ">
                <div className="flex-col gap-2 lg:w-[30%] w-[60%] flex bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-white">
                        Delete Conversation
                    </h2>
                    <hr className="border-gray-600" />
                    <p className="text-gray-300">
                        Are you sure you want to delete conversation "{conversation.name}"?
                    </p>
                    <div className="flex gap-3 mt-4 justify-end">
                        <button
                            onClick={() => setIsConfirmModal(false)}
                            className="px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleDelete(conversation.id)}
                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        }
    </>

}
