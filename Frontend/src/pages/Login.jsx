import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import Logo from '../Logo';

export default function Login() {
    const navigate = useNavigate();
    const { accessToken, login, logout } = useAuth();
    const [error, setError] = useState('');

    const handleLogin = async (formData) => {
        try {
            await login(formData);
            // navigate('/');
        } catch (err) {
            console.error('Login failed:', err);
            setError('Unable to login. Please check your credentials and try again.');
        }
    };

    useEffect(() => {
        if (accessToken) {
            navigate('/'); // Navigate when accessToken is ready
        }
    }, [accessToken, navigate]);



    return (
        // login form
        <div className="flex flex-col justify-center items-center min-h-screen">
            {/* <div className="logo text-white mb-10"><Logo/></div> */}
            <div className="logo text-white mb-10">
                <Logo/>
                </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-md w-11/12 sm:w-96 relative">
                <h1 className="text-2xl font-bold text-center mb-10 text-gray-900">Login to your Account</h1>
                {error && <div className="absolute text-red-500 text-center -top-10">{error}</div>}
                <AuthForm onSubmit={handleLogin} formType="login" />
            </div>
        </div>
    );
}