import { useState, useEffect, useRef } from 'react';

export default function useSocket(token, ws_url) {
    const socketRef = useRef(null);
    const [newResponse, setNewResponse] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            console.log('token is not defined');
            return;
        }
            

        const socketUrl = `${ws_url}${token}/`;
        const socket = new WebSocket(socketUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            setErrorMsg(null);
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'error') {
                console.log(data.message)
                setErrorMsg(data.message);
            } else if (data.type !== 'request_text') {
                setNewResponse(data);
            }
        };

        socket.onclose = () => {
            setIsConnected(false);
            
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            // setErrorMsg(error);
            setIsConnected(false);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [token, ws_url]);

    const sendMessage = (data) => {
        console.log('send message is called in websocket hook');
        console.log(data); 
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            try {
                socketRef.current.send(JSON.stringify(data));
            } catch (err) {
                setErrorMsg(err);
                console.error(err);
            }
        }
        else {
            setErrorMsg('something went wrong');
        }
    };

    const stopStreaming = ()=>{
        if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN){
            try {
                console.log('stop streaming is called in websocket hook');
                socketRef.current.send(JSON.stringify({ type: 'stop_streaming' }));
            } catch (err) {
                console.error(err);
                setErrorMsg(err);
            }
        }
    }

    return [isConnected, newResponse, sendMessage, errorMsg,stopStreaming];
}
