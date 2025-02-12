import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CreateConversation, fetchConversationMessages } from '../services/apiServices';
import HomePageLayout from '../layout/HomePageLayout';
import MessageInput from '../components/MessageInput';

export default function Chatpage() {
    const [messages, setMessages] = useState([]);
    const { conversation_token } = useParams();

    const Question = ({ text }) => (
        <div className="rounded-xl px-4 py-2 bg-gray-700 text-white w-fit">
            {text}
        </div>
    );

    const Response = ({ text }) => (
        <div className="rounded-lg px-4 py-2 bg-gray-600 text-white">
            {text}
        </div>
    );

    const getMessages = async (conversation_token) => {
        try {
            const data = await fetchConversationMessages(conversation_token);
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (conversation_token) {
            getMessages(conversation_token);
        }
    }, [conversation_token]);

    const handleSendMessage = async (message) => {
        if(messages.length === 0){  // if messages is empty, send create conversation  then send message to server
            const response = await CreateConversation(message);
            const conversation_token = response.conversation_token;
            // await sendMessage({ conversation_token, message });
        }
        try {
            const response = await fetchConversationMessages(conversation_token);
            setMessages([...messages, response]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <HomePageLayout>
            <div className="h-full bg-gray-800 relative">
                <div className="h-screen overflow-y-auto pb-10 w-full">
                    <div className="lg:w-[720px] mx-auto px-4 lg:px-8 pb-32 pt-20 flex flex-col gap-8">
                        {messages.map((message, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <Question text={message.request_text} />
                                <Response text={message.response_text} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`absolute bottom-0 ${messages.length === 0 && 'top-1/2'} w-full bg-gray-800`}>
                    <div className="w-full lg:w-[720px] mx-auto p-4 ">
                        <MessageInput onSendMessage={handleSendMessage} />
                    </div>
                </div>
            </div>
        </HomePageLayout>
    );
}
