
import Register from '../pages/Register'
import ChatPage from '../pages/ChatPage'
import ProtectedRoute from './ProtectedRoute'
import ServerErrorPage from '../pages/ServerErrorPage'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Login from '../pages/Login'
import React, { useEffect, useState } from 'react'
import api from '../api'

export default function AppRoutes() {
    const location = useLocation();
    const state = location.state;
    
    return (
        <>
            <Routes location={state?.backgroundLocation || location}>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/c/:conversation_token" element={<ChatPage />} />
                </Route>
                <Route path='/auth'>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
                <Route path="/server-error" element={<ServerErrorPage />} />
                {/* for not found use alert message or not found page  */}

            </Routes>

        </>
    )
}