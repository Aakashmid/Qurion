import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CreateConversation, fetchConversationMessages } from '../services/apiServices';
import HomePageLayout from '../layout/HomePageLayout';
import MessageInput from '../components/MessageInput';
import useSocket from '../hooks/useSocket';
import { Question, Response } from '../components/chat-page/SmallComponents';
import { IoClose, IoReload } from 'react-icons/io5';

export default function ChatPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msgloading, setMsgLoading] = useState(false);
    const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
    const { conversation_token } = useParams();

    const [isWebsocketConnected, newResponse, sendMessage, errorFromWebsocket] = useSocket(conversation_token || null, import.meta.env.VITE_WS_CONVERSATION_URL);

    const getMessages = async (token) => {
        try {
            setLoading(true);
            const data = await fetchConversationMessages(token);
            if (data?.results?.length) {
                setMessages(data.results);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        const element = document.getElementById('chat-container')?.lastChild;
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (newResponse) {
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].response_text = newResponse.response_text;
                return updatedMessages;
            });
            setMsgLoading(false);
        } else if (errorFromWebsocket) {
            console.error("Error from socket:", errorFromWebsocket);
            setMsgLoading(false);
            setIsSomethingWentWrong(true);
        } else {
            setMsgLoading(false);
            setIsSomethingWentWrong(false);
        }
    }, [newResponse, errorFromWebsocket]);

    const waitForWebSocketConnection = async (timeout = 5000) => {
        const startTime = Date.now();

        while (!isWebsocketConnected && (Date.now() - startTime < timeout)) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms
        }

        if (!isWebsocketConnected) {
            console.error("WebSocket did not connect within the timeout period.");
            return false;
        }
        return true;
    };

    const handleSendMessage = async (question) => {
        try {
            setMsgLoading(true);
            if (!conversation_token) {
                // Creating a new chat
                const response = await CreateConversation(question);
                if (response && response.token) {
                    // Navigate to the new conversation route
                    sessionStorage.setItem(`firstQuestion${response.token}`, question);
                    navigate(`/c/${response.token}`);
                    return; // Exit function as we're navigating to a new page
                } else {
                    throw new Error("Failed to create conversation");
                }
            }

            // If we have an existing conversation token
            setMessages(prevMessages => [...prevMessages, { request_text: question, response_text: "" }]);

            if (!isWebsocketConnected) {
                console.warn('WebSocket is not connected. Waiting for connection...');
                const connected = await waitForWebSocketConnection();
                if (!connected) {
                    throw new Error("Failed to connect to WebSocket");
                }
            }

            sendMessage({ "request_text": question });
        } catch (error) {
            console.error('Error sending message:', error);
            setMsgLoading(false);
            setIsSomethingWentWrong(true);
        }
    };

    useEffect(() => {
        if (conversation_token) {
            setMessages([]);
            getMessages(conversation_token);
        } else {
            setMessages([]);
        }
    }, [conversation_token]);

    // Handle first question only once when WebSocket is connected
    useEffect(() => {

        if (conversation_token && isWebsocketConnected) {
            const firstQuestion = sessionStorage.getItem(`firstQuestion${conversation_token}`);
            if (firstQuestion) {
                console.log('Sending first question:', firstQuestion);
    
                // Send the first question
                setMessages([{ request_text: firstQuestion, response_text: "" }]);
                setMsgLoading(true);
                sendMessage({ "request_text": firstQuestion });
                sessionStorage.removeItem(`firstQuestion${conversation_token}`);
            }

        }
    }, [isWebsocketConnected, conversation_token, sendMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <HomePageLayout>
            <div className="h-full bg-gray-800 relative flex flex-col justify-between">
                <div className="overflow-y-auto w-full py-4">
                    <div id='chat-container' className="chat-container lg:w-[720px] mx-auto lg:px-10 flex flex-col gap-8 pb-24">
                        {loading &&
                            <div className="mt-24 px-6 py-2 text-white text-xl w-fit mx-auto ">
                                <div className="h-10 w-10 rounded-full  border-gray-400 animate-spin border-2  border-t-white"></div>
                            </div>}
                        {!loading && messages.map((message, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <Question text={message.request_text} />
                                <Response text={message.response_text} />
                                {msgloading && index === messages.length - 1 && (
                                    <div className="text-white">
                                        <div className="ml-6 w-6 h-6 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                                        <div className="animate-pulse w-full py-2 mt-4 h-20 bg-gray-700"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 w-full bg-gray-800">
                    {isSomethingWentWrong && (
                        <div className="absolute bottom-24 w-full lg:w-[720px] left-1/2 -translate-x-1/2 p-5">
                            <div className="text-red-500 bg-gray-800 gap-4 flex items-center rounded-xl justify-between text-lg border border-red-500 px-6 py-2 duration-200">
                                <span className='w-8 h-auto'><IoReload /></span>
                                <p>Something went wrong, try again</p>
                                <span onClick={() => setIsSomethingWentWrong(false)} className="cursor-pointer">
                                    <IoClose className='w-7 active:text-gray-500 h-auto' />
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="w-full lg:w-[720px] mx-auto p-4">
                        <MessageInput onSendMessage={handleSendMessage} />
                    </div>
                </div>
            </div>
        </HomePageLayout>
    );
}