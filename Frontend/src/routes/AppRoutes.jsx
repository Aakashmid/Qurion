
import Register from '../pages/Register'
import ChatPage from '../pages/ChatPage'
import ProtectedRoute from './ProtectedRoute'
import ServerErrorPage from '../pages/ServerErrorPage'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<ChatPage />} />
                <Route path="/server-error" element={<ServerErrorPage />} />
                <Route path="/c/:conversation_token" element={<ChatPage />} />
            </Route>
            <Route path='/auth'>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

        </Routes>
    )
}