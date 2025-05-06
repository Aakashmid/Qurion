import { useState, useEffect, useRef } from 'react';

export default function useSocket(token, ws_url) {
    const socketRef = useRef(null);
    const [newResponse, setNewResponse] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) return;

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

    return [isConnected, newResponse, sendMessage, errorMsg];
}
