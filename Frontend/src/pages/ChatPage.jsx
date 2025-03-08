import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreateConversation, fetchConversationMessages } from '../services/apiServices';
import HomePageLayout from '../layout/HomePageLayout';
import MessageInput from '../components/MessageInput';

export default function ChatPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            request_text: 'hellow what is your name ',
            response_text: 'i am chatgpt',
        },
        {
            id: 2,
            request_text: 'hellow what is your name ',
            response_text: 'i am chatgpt',
        },
        {
            id: 3,
            request_text: 'hellow what is your name ',
            response_text: 'i am chatgpt',
        },


    ]);
    const [loading, setLoading] = useState(false);
    const [msgloading, setMsgLoading] = useState(false);
    const { conversation_token } = useParams();
    const navigate = useNavigate();

    const getMessages = async (token) => {
        try {
            const data = await fetchConversationMessages(token);
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
        try {
            let token = conversation_token;
            if (!token) {
                const response = await CreateConversation(message);
                token = response.token;
                navigate(`/conversation/${token}`);
            }
            await sendMessageToConversation(token, message);
            getMessages(token);
        } catch (error) {
            console.error(error);
        }
    };

    const Question = ({ text }) => (
        <div className=" hover:bg-gray-500 px-4">
            <div className="rounded-xl p-2  bg-gray-700 text-white w-fit">
                {text}
            </div>
        </div>
    );

    const Response = ({ text }) => (
        <div className="px-4 hover:bg-gray-500">
            <div className="p-2 text-white">
                {text}
            </div>
        </div>
    );

    return (
        <HomePageLayout>
            <div className="h-full bg-gray-800 relative flex flex-col justify-between">
                <div className="overflow-y-scroll  w-full  py-4">
                    <div className="lg:w-[720px] mx-auto  lg:px-10 flex flex-col gap-8">

                        {loading && <div className="">Loading ...</div>
                        }
                        {!loading && messages.length > 0 && messages.map((message, index) => (
                            <div key={index} className="flex flex-col gap-2 ">
                                <Question text={message.request_text} />
                                <Response text={message.response_text} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`absolute bottom-0  w-full bg-gray-800`}>
                    <div className="w-full lg:w-[720px] mx-auto p-4">
                        <MessageInput onSendMessage={handleSendMessage} />
                    </div>
                </div>
            </div>
        </HomePageLayout>
    );
}
