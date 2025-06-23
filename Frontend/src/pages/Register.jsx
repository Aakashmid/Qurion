import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import Logo from '../Logo';
import BeatLoader from 'react-spinners/BeatLoader';
import useLoading from '../hooks/useLoading';


export default function Register() {
  const { register, accessToken } = useAuth();
  const [error, setError] = useState('');
  const { loading, stopLoading, startLoading } = useLoading();
  const navigate = useNavigate();

  const handleRegisteration = async (formData) => {
    startLoading();
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
    finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate('/'); // Navigate when accessToken is ready
    }
  }, [accessToken, navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[100dvh]">
      {loading &&
        <span className="fixed top-0 left-0 flex justify-center items-center w-screen h-[100dvh] bg-black/50 backdrop-blur-[2px] z-20">
          <BeatLoader/>
        </span>
      }
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-11/12 sm:w-96">
        <div className="logo text-white mb-10 flex justify-center ">
          <Logo />
        </div>
        <AuthForm error={error} formType="register" onSubmit={handleRegisteration} />
      </div>
    </div>
  )
}