import { useState } from 'react'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Chatpage from '../pages/Chatpage'
import ProtectedRoute from './ProtectedRoute'
import ServerErrorPage from '../pages/ServerErrorPage'
import { Route, Routes } from 'react-router-dom'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/auth'>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
            
            {/* <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Chatpage />} />
                <Route path="/" element={<Chatpage />} />
                <Route path="/server-error" element={<ServerErrorPage />} />
                <Route path="/c/:conversation_token" element={<Chatpage />} />
            </Route> */}
        </Routes>
    )
}