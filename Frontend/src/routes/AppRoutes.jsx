
import Register from '../pages/Register'
import ChatPage from '../pages/ChatPage'
import ProtectedRoute from './ProtectedRoute'
import ServerErrorPage from '../pages/ServerErrorPage'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from '../pages/Login'
import SettingsModal from '../components/sidebar-components/SettingsModal'
import React, { useEffect, useState } from 'react'

export default function AppRoutes() {
    const location = useLocation();
    const state = location.state;

    const [showSettings, setShowSettings] = useState(false);

    // // Open modal if hash is #settings
    // useEffect(() => {
    //     const handleHashChange = () => {
    //         setShowSettings(window.location.hash === "#settings");
    //     };
    //     window.addEventListener("hashchange", handleHashChange);
    //     // Initial check
    //     handleHashChange();
    //     return () => window.removeEventListener("hashchange", handleHashChange);
    // }, []);

    // const openSettings = () => {
    //     window.location.hash = "#settings";
    // };

    // const closeSettings = () => {
    //     // Remove the hash without reloading
    //     window.history.pushState("", document.title, window.location.pathname + window.location.search);
    //     setShowSettings(false);
    // };

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

            </Routes>
            {/* {showSettings && <div className="fixed top-0 left-0 w-screen h-screen z-30 bg-black bg-opacity-50 flex items-center justify-center px-10">
                <SettingsModal onClose={closeSettings} />
            </div>} */}
        </>
    )
}