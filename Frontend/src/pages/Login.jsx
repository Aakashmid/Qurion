import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();


    const handleLoginWithGoogle = () => {
        try {
            // Redirect the user to the Google login endpoint
            const backendLoginUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/google/login/`;
            const redirectUri = `${window.location.origin}/auth/google/callback/`; // Frontend callback URL

            // Open the Google login page
            window.location.href = `${backendLoginUrl}?next=${redirectUri}`;
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    }

    
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <form className="space-y-4">
                    <div>
                        <label className="block  font-medium text-gray-700">Email or Username</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                            placeholder="Enter your email or username"
                        />
                    </div>
                    <div>
                        <label className="block  font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your password"
                        />
                        <div className="mt-2"> <p className="">Don't have an account ? <spand className="text-blue-500 cursor-pointer  hover:underline underline-offset-1" onClick={()=>navigate('/auth/register')}>Register</spand></p></div>
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
                        <div className="relative flex justify-center ">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <button disabled={true} onClick={() => handleLoginWithGoogle()}
                        type="button"
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>
                </form>
            </div>
        </div>
    )
}
