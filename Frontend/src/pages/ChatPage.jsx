import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CreateConversation, fetchConversationMessages } from '../services/apiServices';
import HomePageLayout from '../layout/HomePageLayout';
import MessageInput from '../components/MessageInput';
import useSocket from '../hooks/useSocket';
import { Question, Response } from '../components/chat-page/SmallComponents';
import { IoClose, IoReload } from 'react-icons/io5';
import { HiArrowDown } from 'react-icons/hi2';

export default function ChatPage() {
    const location = useLocation();
    const { first_question } = location.state || {};
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msgloading, setMsgLoading] = useState(false);
    const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
    const { conversation_token } = useParams();

    const navigate = useNavigate();

    const [IsWebsocketConnected, newResponse, sendMessage, ErrorFromWebsoket] = useSocket(conversation_token || null, import.meta.env.VITE_WS_CONVERSATION_URL);

    // handlle load more conversation on scroll down , fetch more // **** important


    const getMessages = async (token) => {
        try {
            setLoading(true);
            const data = await fetchConversationMessages(token);
            if (data && data.results.length != 0) {
                setMessages(data.results);
            }
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (newResponse) {
            const updatedMessages = [...messages];
            updatedMessages[updatedMessages.length - 1].response_text = newResponse.response_text;
            setMsgLoading(false);
            setMessages(updatedMessages);
        }
        else if (ErrorFromWebsoket != null && ErrorFromWebsoket != undefined) {
            console.log("Error from socket", ErrorFromWebsoket);
            setMsgLoading(false);
            setIsSomethingWentWrong(true);
        }
        else if (ErrorFromWebsoket == null || ErrorFromWebsoket == undefined) {
            setMsgLoading(false);
            setIsSomethingWentWrong(false);
        }

    }, [newResponse, ErrorFromWebsoket]);



    const handleSendMessage = async (question) => {
        try {
            let token = conversation_token;
            if (!token) { // handle the case where token is not available            
                const response = await CreateConversation(question);
                token = response.token;
                navigate(`/c/${token}`, { state: { first_question: question } });
            }
            else {
                setMessages((prevMessages) => [...prevMessages, { request_text: question, response_text: "" }]);
                sendMessage({ "request_text": question });
                setMsgLoading(true);
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (conversation_token) {
            setMessages([]);
            getMessages(conversation_token);
        }
        else {
            setMessages([]);
        }
    }, [conversation_token]);

    useEffect(() => {
        if (first_question && first_question.trim() !== "") {
            handleSendMessage(first_question);
        }
    }, [first_question])


    const scrollToBottom = () => {
        const element = document.getElementById('chat-container').lastChild
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const scrollToTop = () => {
        const element = document.getElementById('chat-container').firstChild
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    // create button to scroll to top and scroll to bottom

    return (
        <HomePageLayout>
            <div className="h-full bg-gray-800 relative flex flex-col justify-between">
                <div className="overflow-y-auto  w-full  py-4">
                    <div id='chat-container' className="chat-container lg:w-[720px] mx-auto  lg:px-10 flex flex-col gap-8 pb-24">
                        {loading && <div className="">Loading ...</div>
                        }
                        {!loading && messages.length > 0 && messages.map((message, index) => (
                            <div key={index} className="flex flex-col gap-2 ">
                                <Question text={message.request_text} />
                                <Response text={message.response_text} />
                                {msgloading && messages.length - 1 === index &&
                                    <div className="text-white  ">
                                        <div className="ml-6 w-6 h-6 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                                    </div>
                                }
                            </div>
                        ))}

                    </div>

                </div>
                <div className={`absolute bottom-0  w-full bg-gray-800`}>
                    {isSomethingWentWrong && <div className="absolute bottom-24  w-full lg:w-1/2   px-5 mx-auto">
                        <div className="text-red-500 bg-gray-800 gap-4 flex items-center rounded-xl justify-between  text-lg border border-red-500  px-6 py-2  duration-200">
                            <span className='w-8 h-auto'><IoReload /> </span>
                            <p className="">
                                Something went wrong
                                try again
                            </p>
                            <span onClick={() => setIsSomethingWentWrong(false)} className=""><IoClose className='w-7 active:text-gray-500 h-auto' /></span>
                        </div>
                    </div>
                    }
                    <div className="absolute bottom-24 right-10">
                        <div onClick={() => scrollToBottom()} className="text-white cursor-pointer active:bg-gray-600 hover:bg-gray-600 bg-gray-500 rounded-full p-2"><HiArrowDown className='h-4 w-auto' /></div>
                    </div>
                    <div className="w-full lg:w-[720px] mx-auto p-4">
                        <MessageInput onSendMessage={handleSendMessage} />
                    </div>
                </div>
            </div>
        </HomePageLayout>
    );
}
