import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { RegisterUser } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import Logo from '../Logo';


export default function Register() {
  const { register, accessToken } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegisteration = async (formData) => {
    try {
      await register(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate('/'); // Navigate when accessToken is ready
    }
  }, [accessToken, navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="logo text-white mb-10">
        <Logo  />
      </div>
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-11/12 sm:w-96">
        <h1 className="text-2xl font-bold text-center mb-10 text-gray-900">Create your Account </h1>
        {error && <div className="absolute text-red-500 text-center -top-10">{error}</div>}
        <AuthForm formType="register" onSubmit={handleRegisteration} />
      </div>
    </div>
  )
}