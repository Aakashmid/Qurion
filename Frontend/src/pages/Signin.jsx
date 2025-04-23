import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signin() {
    const navigate = useNavigate();
    const { signin } = useAuth();

    const [signInData, setSignInData] = useState({
        username_or_email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignInData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            await signin(signInData);
            navigate('/');
        } catch (err) {
            console.error('Signin failed:', err);
        }
    };




    const handleSigninWithGoogle = () => {
        try {
            const backendSigninUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/google/Signin/`;
            const redirectUri = `${window.location.origin}/auth/google/callback/`;

            window.location.href = `${backendSigninUrl}?next=${redirectUri}`;
        } catch (error) {
            console.error("Error during Google Signin:", error);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
                <form className="space-y-4" onSubmit={handleSignin}>
                    <div>
                        <label className="block font-medium text-gray-700">Email or Username</label>
                        <input required
                            type="text"
                            name="username_or_email"
                            value={signInData.username_or_email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                            placeholder="Enter your email or username"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Password</label>
                        <input required
                            type="password"
                            name="password"
                            value={signInData.password}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your password"
                        />
                        <div className="mt-2">
                            <p className="">Don't have an account? <span className="text-blue-500 cursor-pointer hover:underline underline-offset-1" onClick={() => navigate('/auth/register')}>Register</span></p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Sign in
                    </button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <button
                        onClick={handleSigninWithGoogle}
                        type="button"
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>
                </form>
            </div>
        </div>
    );
}