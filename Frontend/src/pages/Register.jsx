import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

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
      if (err.response && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error;
        setError(errorMessage); // Display the error message to the user
      } else {
        console.error('Error:', error);
        setError('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate('/'); // Navigate when accessToken is ready
    }
  }, [accessToken, navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[100dvh]">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-11/12 sm:w-96">
        <div className="logo text-white mb-10 flex justify-center ">
          <Logo />
        </div>
        <AuthForm error={error} formType="register" onSubmit={handleRegisteration} />
      </div>
    </div>
  )
}