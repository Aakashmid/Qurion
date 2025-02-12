let socket = null;
let callbacks = {};

const connect = (conversationToken) => {
    const path = `ws://127.0.0.1:8000/ws/conversations/${conversationToken}/`;
    socket = new WebSocket(path);

    socket.onopen = () => {
        console.log('WebSocket open');
    };

    socket.onmessage = (e) => {
        socketNewMessage(e.data);
    };

    socket.onerror = (e) => {
        console.log(e.message);
    };

    socket.onclose = () => {
        console.log('WebSocket closed');
        connect(conversationToken); // Reconnect on close
    };
};

const socketNewMessage = (data) => {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(callbacks).length === 0) {
        return;
    }
    if (command === 'new_message') {
        callbacks[command](parsedData.message);
    }
};

const addCallbacks = (newMessageCallback) => {
    callbacks['new_message'] = newMessageCallback;
};

const sendMessage = (data) => {
    try {
        socket.send(JSON.stringify({ ...data }));
    } catch (err) {
        console.log(err.message);
    }
};

const waitForSocketConnection = (callback) => {
    const recursion = waitForSocketConnection;
    setTimeout(() => {
        if (socket.readyState === 1) {
            console.log('Connection is made');
            if (callback != null) {
                callback();
            }
            return;
        } else {
            console.log('Waiting for connection...');
            recursion(callback);
        }
    }, 1);
};

export { connect, addCallbacks, sendMessage, waitForSocketConnection };