import React, { useEffect, useState } from 'react'
import { PiDotsThree } from 'react-icons/pi';
import { DeleteConversation, UpdateConversation } from '../../services/apiServices';
import {useLongPress} from 'use-long-press';

export default function ConversationLink({ conversation, onClickLink, selectedConversation, setConversations }) {
    const [showOptionIcon, setShowOptionIcon] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [conversationName, setConversationName] = useState(conversation.name);
    const [formInput, setFormInput] = useState(conversation.name);
    const [showActionBtn, setShowActionBtn] = useState(selectedConversation === conversation.id);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleLongPress = useLongPress((event) => {
        if (window.innerWidth < 1024) {
            const touch = event.touches[0];
            setPosition({ x: touch.clientX, y: touch.clientY });
            setShowActionMenu(true);
        }
    });

    const handleMouseEnter = () => {
        if (window.innerWidth >= 1024) {
            setShowOptionIcon(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 1024) {
            setShowOptionIcon(false);
        }
    };

    const handleRename = async () => {
        try {
            if (formInput.trim() !== '') {
                const data = await UpdateConversation(conversation.token, formInput);
                if (data) {
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
            setConversations((prevConvs) => prevConvs.filter((con) => con.id !== conversation.id));
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            const renameInput = document.querySelector('.rename-input');
            const actionMenu = document.querySelector('.action-menu');
            if (renameInput && !renameInput.contains(event.target)) {
                setShowRenameModal(false);
            }
            if (actionMenu && !actionMenu.contains(event.target)) {
                setShowActionMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    return <>
        <div
            className='flex-grow text-sm lg:text-base'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            
        >
            <div {...handleLongPress()} onClick={() => onClickLink(conversation)} className={`${selectedConversation === conversation.id ? 'bg-gray-800' : ''} relative overflow-hidden flex flex-col px-3 py-2 hover:bg-gray-800 cursor-pointer rounded-lg transition-colors duration-200`}>
                <p className='text-gray-200 font-medium'>{conversation.name.length > 30 ? conversation.name.substring(0, 30) + '...' : conversation.name}</p>

                {showActionMenu && (
                    <div
                        className="action-menu absolute bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50"
                        style={{
                            top: window.innerWidth >= 1024 ? '100%' : position.y,
                            left: window.innerWidth >= 1024 ? 'auto' : position.x,
                            right: window.innerWidth >= 1024 ? '0' : 'auto',
                        }}
                    >
                        <div className="py-2 px-4 hover:bg-gray-800 cursor-pointer text-gray-200" onClick={() => setShowRenameModal(true)}>Rename</div>
                        <div className="py-2 px-4 hover:bg-gray-800 cursor-pointer text-gray-200" onClick={handleDelete}>Delete</div>
                    </div>
                )}

                {showOptionIcon &&
                    <div onClick={(e) => {
                        e.stopPropagation()
                        setShowActionMenu(!showActionMenu);
                    }} className="absolute right-0 top-0 p-1 pl-2 hover:bg-gradient-to-r h-full hover:from-transparent hover:to-gray-700 bg-opacity-40 z-10 flex justify-center items-center">
                        <PiDotsThree className="h-6 w-auto text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                }
            </div>

            {showRenameModal &&
                <input
                    type="text"
                    className="rename-input w-full bg-gray-900 text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-0 focus:ring-blue-500"
                    value={conversation.name}
                    onChange={(e) => {
                        setConversations((prevConvs) =>
                            prevConvs.map((conv) =>
                                conv.id === conversation.id ? { ...conv, name: e.target.value } : conv
                            )
                        );
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setShowRenameModal(false);
                        }
                        if (e.key === 'Escape') {
                            setShowRenameModal(false);
                        }
                    }}
                    autoFocus
                />
            }
        </div>
    </>
}