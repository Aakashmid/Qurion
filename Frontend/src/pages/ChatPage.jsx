import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import MessageInput from '../components/MessageInput'

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
    ])
    const Question = ({ text }) => {
        return (
            <div className="rounded-xl px-4 py-2 bg-gray-800 text-white w-fit">
                {text}
            </div>
        )
    }

    const Response = ({ text }) => {
        return (
            <div className="rounded-lg px-4 py-2  text-white">
                {text}
            </div>
        )
    }

    return (
        <div className="container w-full">
            <div className="grid grid-cols-12 ">
                <div className="col-span-3  sidebar h-screen">
                    <Sidebar />
                </div>
                <div className="col-span-9   h-screen bg-gray-700 chat-wrapper py-10 relative">
                    <div className="chat-content mx-auto lg:w-[70%] h-full  flex flex-col gap-10 px-10 overflow-y-auto ">
                        {messagess.map((message, index) => (
                            <div key={index} className="message flex flex-col gap-4">
                                <Question text={message.request_text} />
                                <Response text={message.response_text} />
                            </div>
                        ))}
                    </div>
                    <div className="message-input absolute bottom-10 w-full lg:w-[70%] left-1/2 -translate-x-1/2">
                        <MessageInput/>
                    </div>
                </div>
            </div>
        </div>
    )
}
