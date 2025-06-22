import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import Logo from '../Logo';
import useLoading from '../hooks/useLoading';

export default function Login() {
    const navigate = useNavigate();
    const { accessToken, login, logout } = useAuth();
    const [error, setError] = useState('');
    const {startLoading,loading,stopLoading} = useLoading();

    const handleLogin = async (formData) => {
        startLoading();
        try {
            await login(formData);
            // navigate('/');
        } catch (err) {
            setError('username or password is incorrect');
        }
        finally{
            stopLoading();
        }
    };

    useEffect(() => {
        if (accessToken) {
            navigate('/'); // Navigate when accessToken is ready
        }
    }, [accessToken, navigate]);



    return (
        // login form
        <div className="flex flex-col justify-center items-center min-h-[100dvh]">
            <div className="bg-gray-100 p-8 rounded-lg shadow-md w-11/12 sm:w-96">
                <div className="logo text-white mb-10 flex justify-center ">
                    <Logo />
                </div>
                <AuthForm error={error} formType="login" onSubmit={handleLogin} />
            </div>
        </div>
    );
}