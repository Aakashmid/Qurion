
import { useState, useEffect } from 'react';
export default function useSocket(token, ws_url) {
    const [socket, setSocket] = useState(null);
    const [newResponse, setNewResponse] = useState(null);
    const [error_msg, setErrorMsg] = useState(null);
    useEffect(() => {
        if (!token) return;
        else {
            const socketUrl = `${ws_url}${token}/`;
            const socket = new WebSocket(socketUrl);
            setSocket(socket);
            socket.onopen = () => {
                console.log('WebSocket open');
            };
            let count=0;
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if(data && data.type != 'request_text'){
                    console.log(data)
                }
                setNewResponse(data);
            };
            socket.onclose = () => {
                console.log('WebSocket closed');
            };
            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                setErrorMsg(error.message);
            };
            return () => {
                socket.close();
            };
        }
    }, [])

    const sendMessage = (data) => {
        if (socket) {

            try {
                socket.send(JSON.stringify({ ...data }));
            } catch (err) {
                setErrorMsg(err);
                console.log(err);
            }
        }
    };

    return [newResponse, sendMessage, error_msg];
}
