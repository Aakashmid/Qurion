
import Register from '../pages/Register'
import Chatpage from '../pages/Chatpage'
import ProtectedRoute from './ProtectedRoute'
import ServerErrorPage from '../pages/ServerErrorPage'
import { Route, Routes } from 'react-router-dom'
import Signin from '../pages/Signin'

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Chatpage />} />
                <Route path="/server-error" element={<ServerErrorPage />} />
                <Route path="/c/:conversation_token" element={<Chatpage />} />
            </Route>
            <Route path='/auth'>
                <Route path="signin" element={<Signin />} />
                <Route path="register" element={<Register />} />
            </Route>

        </Routes>
    )
}