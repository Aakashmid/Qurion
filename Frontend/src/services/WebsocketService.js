let socket = null;
let callbacks = {};
let retryCount = 0;
const maxRetries = 5; // Maximum number of retries
const retryDelay = 2000; // Delay between retries in milliseconds

const connect = (conversationToken) => {
    const path = `ws://127.0.0.1:8000/ws/conversations/${conversationToken}/`;
    socket = new WebSocket(path);

    socket.onopen = () => {
        console.log('WebSocket open');
        retryCount = 0; // Reset retry count on successful connection
    };
    
    socket.onmessage = (e) => {
        socketNewMessage(e.data);
    };

    socket.onerror = (e) => {
        console.log(e.message);
    };

    socket.onclose = () => {
        console.log('WebSocket closed');
        if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
            setTimeout(() => connect(conversationToken), retryDelay);
        } else {
            console.log('Max retries reached. Connection failed.');
        }
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

export { connect, addCallbacks, sendMessage, waitForSocketConnection, socket };