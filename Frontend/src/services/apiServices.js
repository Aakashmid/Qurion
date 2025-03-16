import api from "../api"
 export const checkServerStatus = async () => {
    try {
        const response = await api.get("/server-status/")
        return response.data
    } catch (error) {
        throw new Error("Server is down")
    }
}

export const  fetchConversations = async () => {
    try {
        const res = await api.get(`/conversations/`)
        return res.data
    } catch (error) {
        throw new Error("Error fetching conversation")
    }
}

export const fetchConversationMessages = async (conversation_token) => {
    try {
        const res = await api.get(`/conversations/${conversation_token}/messages/`)
        return res.data
    } catch (error) {
        throw new Error("Error fetching conversation messages")
    }
}


export const CreateConversation = async (conversation_name) => {
    try {
        const res = await api.post("/conversations/", {
            name: conversation_name
        })
        return res.data
    } catch (error) {
        throw new Error("Error creating conversation")
    }
}

export const getConversationDetail = async (conversation_token) => {
    try {
        const res = await api.get(`/conversations/${conversation_token}`)
        return res.data
    } catch (error) {
        throw new Error("Error fetching conversation detail")
    }
}


export const UpdateConversation = async (conversation_token, conversation_name) => {
    try {
        const res = await api.put(`/conversations/${conversation_token}/`, {
            name: conversation_name
        })
        return res.data
    } catch (error) {
        throw new Error("Error updating conversation")
    }
}

export const DeleteConversation = async (conversation_token) => {
    try {
        const res = await api.delete(`/conversations/${conversation_token}/`)
        return res.data
    } catch (error) {
        throw new Error("Error deleting conversation")
    }
}