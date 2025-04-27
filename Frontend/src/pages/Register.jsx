import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { RegisterUser } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';


export default function Register() {
    const { register } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegisteration = async (formData) => {
      try {
        await register(formData);
        // navigate('/'); // Redirect to home or another page after successful registration
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-center mb-10">Create your Account </h1>
                {error && <div className="absolute text-red-500 text-center -top-10">{error}</div>}
                <AuthForm formType="register" onSubmit={handleRegisteration} />
            </div>
        </div>
    )
}