import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import MessageInput from '../components/MessageInput'
import useToggle from '../hooks/useToggle'
import { useParams } from 'react-router-dom'

export default function Chatpage() {
    const [messages, setMessages] = useState([])
    const {conversation_name} = useParams();

    const Question = ({ text }) => {
        return (
            <div className="rounded-xl px-4 py-2 bg-gray-700 text-white w-fit">
                {text}
            </div>
        )
    }

    const Response = ({ text }) => {
        return (
            <div className="rounded-lg px-4 py-2  bg text-white">
                {text}
            </div>
        )
    }

    const getMessages = async (conversation_name) => {
        console.log('get messages from db of current conversation')
    }

    useEffect(() => {
        if (conversation_name){
            getMessages(conversation_name)
            console.log('get messages from db of current conversation')
        }
    }, [conversation_name])
    
    return (
        <div className="chatpage-wrapper">
            <div className="w-full h-screen bg-gray-800">
                <div className="h-screen w-full overflow-y-auto pb-10">
                    <div className="content w-full lg:w-[720px] mx-auto px-4 lg:px-8 pb-32 pt-20 flex flex-col gap-8">
                        {messages.map((message, index) => (
                            <div className="flex flex-col gap-2">
                                <Question text={message.request_text} />
                                <Response text={message.response_text} />
                            </div>

                        ))}
                    </div>
                </div>

                <div className={`fixed bottom-0 ${messages.length == 0 && 'top-1/2'} w-full bg-gray-800`}>
                    <div className="w-full lg:w-[720px] mx-auto p-4">
                        <MessageInput room_name={"test"} />
                    </div>
                </div>
            </div>
        </div>)
}
