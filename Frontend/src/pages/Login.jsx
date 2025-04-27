import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';

export default function Login() {
    const navigate = useNavigate();
    const { accessToken,login } = useAuth();
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
        console.log(accessToken)
        if (accessToken) {
          navigate('/'); // Navigate when accessToken is ready
        }
      }, [accessToken, navigate]);

    return (
        // login form
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 relative">
                <h1 className="text-2xl font-bold text-center mb-10">Login to your Account</h1>
                {error && <div className="absolute text-red-500 text-center -top-10">{error}</div>}
                <AuthForm onSubmit={handleLogin} formType="login" />
            </div>
        </div>
    );
}