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
        <div className='flex-grow'>
            <div onClick={() => onClickLink(conversation)} className='flex flex-col gap-2 px-3 py-2 hover:bg-gray-800 cursor-pointer rounded-lg transition-colors'>
                <p className='text-gray-200 font-medium'>{conversation.name.length > 30 ? conversation.name.substring(0, 30) + '...' : conversation.name}</p>
                <p className="text-sm text-gray-400">{`hellow guey howe are this is new conversation dummy data , i am going to become the world one of the richest person and i am going to give my 100% to reach there`.substring(0, 35)}...</p>
            </div>
        </div>

        {/* have to create , option menu -rename , delete and rename modal (form) */}
    </>
}