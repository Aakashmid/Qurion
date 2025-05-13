import React, { useEffect, useRef, useState } from 'react'
import { PiDotsThree } from 'react-icons/pi';
import { DeleteConversation, UpdateConversation } from '../../services/apiServices';
import { useLongPress } from 'use-long-press';
import { useSidebar } from '../../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import useClickOutside from '../../hooks/useClickOutside';

export default function ConversationLink({ conversation, onClickLink, selectedConversation, }) {
    const [showOptionIcon, setShowOptionIcon] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [conversationName, setConversationName] = useState(conversation.name);
    const [showActionBtn, setShowActionBtn] = useState(selectedConversation === conversation.id);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const { setConversations } = useSidebar();

    const navigate = useNavigate();

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
            if (conversationName.trim() !== '') {
                const data = await UpdateConversation(conversation.token, conversationName);
                if (data) {
                    console.log(data);
                    setConversationName(conversationName);
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
            if (selectedConversation === conversation.id) {
                navigate('/');
            }
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    }

    const convLinkRef = useRef();
    const threeDotRef = useRef();
    const menuRef = useRef();
    const renameRef = useRef();

    useClickOutside(menuRef, () => setShowActionMenu(false));
    useClickOutside(renameRef, () => setShowRenameModal(false));

    const handleConversationClick = (event) => {
        if (!threeDotRef.current?.contains(event.target)) {
            onClickLink(conversation);
            setShowActionMenu(false);
        }
    }


    // have to update
    const calculateMenuPosition = () => {
        if (convLinkRef.current && menuRef.current) {
            const linkRect = convLinkRef.current.getBoundingClientRect();
            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            let top = 10;
            let right = 4;

            // Check if menu would go below viewport
            if (linkRect.bottom + menuRect.height > viewportHeight) {
                top = -menuRect.height + linkRect.height;
            }

            // Check if menu would go beyond right edge
            if (linkRect.right + menuRect.width > viewportWidth) {
                right = menuRect.width;
            }

            setMenuPosition({ top, right });
        }
    };

    useEffect(() => {
        if (showActionMenu) {
            calculateMenuPosition();
        }
    }, [showActionMenu]);

    
    const handleLongPress = useLongPress(() => {
        setShowActionMenu(true);
    }, {
        onCancel: () => {
            setShowActionMenu(false);
        },
    });

    return <>
        <div ref={convLinkRef}
            className='flex-grow text-sm lg:text-base relative conversation-link'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {!showRenameModal ?
                <div {...handleLongPress()} onClick={(e) => handleConversationClick(e)} className={`${selectedConversation === conversation.id ? 'bg-gray-800' : 'hover:bg-gray-800/50'} relative  flex flex-col overflow-hidden px-3 py-2  cursor-pointer rounded-lg transition-colors duration-200`}>
                    <p className='text-gray-200 font-medium'>{conversationName.length > 30 ? conversationName.substring(0, 30) + '...' : conversationName}</p>
                    {showOptionIcon &&
                        <div ref={threeDotRef} id='three-dot' onClick={(e) => {
                            setShowActionMenu(!showActionMenu);
                        }} className="absolute right-0 top-0 p-1 pl-2 hover:bg-gradient-to-r h-full hover:from-transparent hover:to-gray-700 bg-opacity-40 z-10 flex justify-center items-center">
                            <PiDotsThree className="h-6 w-auto text-gray-400 hover:text-white cursor-pointer" />
                        </div>
                    }
                </div>
                :
                <div className="rename-modal" ref={renameRef} >
                    <input
                        type="text"
                        className="rename-input w-full bg-gray-950 text-gray-200 px-3 py-2 rounded-lg focus:outline-none "
                        value={conversationName}
                        onChange={(e) => {
                            setConversationName(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setShowRenameModal(false);
                                handleRename();
                            }
                            if (e.key === 'Escape') {
                                setShowRenameModal(false);
                            }
                        }}
                        autoFocus
                    />
                </div>
            }

            {showActionMenu && (
                <div
                    ref={menuRef}
                    style={{
                        top: `${menuPosition.top}px`,
                        right: `${menuPosition.right}px`
                    }}
                    className="action-menu absolute bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="py-2 px-4 hover:bg-gray-800 cursor-pointer text-gray-200" onClick={() => { setShowRenameModal(true); setShowActionMenu(false); }}>Rename</div>
                    <div className="py-2 px-4 hover:bg-gray-800 cursor-pointer text-red-600" onClick={() => handleDelete()}>Delete</div>
                </div>)
            }
        </div>
    </>
}