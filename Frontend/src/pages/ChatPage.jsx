import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CreateConversation, fetchConversationMessages } from '../services/apiServices';
import HomePageLayout from '../layout/HomePageLayout';
import MessageInput from '../components/MessageInput';
import useSocket from '../hooks/useSocket';
import { Question, Response } from '../components/chat-page/SmallComponents';

export default function ChatPage() {
    const location = useLocation();
    const { first_question } = location.state || {};
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msgloading, setMsgLoading] = useState(false);
    const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
    const { conversation_token } = useParams();

    const navigate = useNavigate();

    const [newResponse, sendMessage, onError] = useSocket(conversation_token || null, import.meta.env.VITE_WS_CONVERSATION_URL);

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
            // console.log(typeof newResponse);
            // console.log(first)
            const updatedMessages = [...messages];
            updatedMessages[updatedMessages.length - 1].response_text = newResponse.response_text;
            setMessages(updatedMessages);
        }
        else if (onError) {
            console.log("Error from socket", onError);
            setMsgLoading(false);
            setIsSomethingWentWrong(true);
        }
    }, [newResponse, onError]);



    const handleSendMessage = async (question) => {
        try {
            let token = conversation_token;
            if (!token) { // handle the case where token is not available            
                const response = await CreateConversation(question);
                token = response.token;
                navigate(`/conversation/${token}`, { state: { first_question: question } });
            }
            else {
                setMessages((prevMessages) => [...prevMessages, { request_text: question, response_text: "" }]);
                sendMessage({ "request_text": question });
                console.log({ "request_text": question })
                setMsgLoading(true);
                // {"request_text":"Tell me about yourself "}
                // getMessages(token);
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (conversation_token) {
            getMessages(conversation_token);
        }
    }, [conversation_token]);

    useEffect(() => {
        if (first_question && first_question.trim() !== "") {
            handleSendMessage(first_question);
        }
    }, [first_question])

    return (
        <HomePageLayout>
            <div className="h-full bg-gray-800 relative flex flex-col justify-between">
                <div className="overflow-y-auto  w-full  py-4">
                    <div className="lg:w-[720px] mx-auto  lg:px-10 flex flex-col gap-8">

                        {loading && <div className="">Loading ...</div>
                        }
                        {!loading && messages.length > 0 && messages.map((message, index) => (
                            <div key={index} className="flex flex-col gap-2 ">
                                {/* <Question text={message.request_text} />
                                <Response text={message.response_text} /> */}
                            </div>
                        ))}
                        {isSomethingWentWrong && <div className="text-red-500 p-2 my-4 w-fit mx-auto">Something went wrong</div>}
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
