

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute prevents access to nested routes
 * unless an accessToken is present in memory.
 *
 * @param {string} redirectPath - URL to redirect unauthenticated users to
 */

const ProtectedRoute = ({ redirectPath = '/auth/signin' }) => {
    const { accessToken } = useAuth();  // get accessToken from AuthContext

    // If no token, redirect to login (replace history to avoid back-button leakage)
    if (!accessToken) {
        return <Navigate to={redirectPath} replace />;  // client-side navigation redirect :contentReference[oaicite:2]{index=2}
    }

    // If token exists, render whatever child routes are nested under this route
    return <Outlet />;
};

export default ProtectedRoute;  
