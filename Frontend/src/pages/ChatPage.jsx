import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import MessageInput from '../components/MessageInput'
import useToggle from '../hooks/useToggle'

export default function Chatpage() {

    const [messagess, setMessages] = useState([{
        request_text: "Hello, how are you?",
        response_text: "I'm doing well, thank you for asking. How about you?",
    },
    {
        request_text: "I'm doing well, thank you for asking. How about you?",
        response_text: "I'm doing well, thank you for asking. How about you?",
    },
    {
        request_text: "I'm doing well, thank you for asking. How about you?",
        response_text: "I'm doing well, thank you for asking. How about you?",
    },
    {
        request_text: "I'm doing well, thank you for asking. How about you?",
        response_text: "I'm doing well, thank you for asking. How about you?",
    },
    {
        request_text: "I'm doing well, thank you for asking. How about you?",
        response_text: "I'm doing well, thank you for asking. How about you?",
    },
    {
        request_text: "I'm doing well, thank you for asking. How about you?",
        response_text: "I'm doing well, thank you for asking. How about you?",
    },
    {
        request_text: "I'm doing well, thank you for asking. How about you?",
        response_text: "I'm doing well, thank you for asking. How about you?",
    },
    {
        request_text: "I'm doing well, thank you for asking. How about you?",
        response_text: "I'm doing well, thank you for asking. How about you?",
    },
    {
        request_text: "I'm doing well, thank you for asking. How about you?",
        response_text: "I'm doing well, thank you for asking. How about you?",
    },
    ])
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

    return (
        <div className="chatpage-wrapper">
            <div className="w-full h-screen bg-gray-800">
                <div className="h-screen w-full overflow-y-scroll pb-10">
                    <div className="content w-full lg:w-[800px] mx-auto px-4 lg:px-8 pb-32 pt-20 flex flex-col gap-8">
                        {messagess.map((message, index) => (
                            <div className="flex flex-col gap-2">
                                <Question text={message.request_text} />
                                <Response text={message.response_text} />
                            </div>

                        ))}
                    </div>
                </div>
                <div className="fixed bottom-0 w-full bg-gray-800">
                    <div className="w-full lg:w-[800px] mx-auto p-4">
                        <MessageInput room_name={"test"}/>
                    </div>
                </div>
            </div>
        </div>)}
