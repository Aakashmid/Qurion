import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { RegisterUser } from '../services/apiServices';


export default function Register() {
    localStorage.clear();
    const [formData, setFormData] = useState({
        username_or_email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRegisteration = async (e) => {
        e.preventDefault();
        try {
            const res_data = await RegisterUser({
                username_or_email: formData.username_or_email,
                password: formData.password
            });
            // if (res_data) {
            //     if (res_data.access) {
            //         localStorage.setItem('token', res_data.token);
            //         localStorage.setItem('user_id', res_data.user_id);
            //         navigate('/');
            //     }
            //     else {
            //         console.log("Error during registration:", res_data.error);
            //     }
            // }
            // console.log(res_data);

        }
        catch (error) {
            console.error(error);
        }
    }

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
                <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
                <form onSubmit={handleRegisteration} className="space-y-4">
                    <div>
                        <label className="block font-medium text-gray-700">Email or Username</label>
                        <input
                            type="text"
                            name="username_or_email"
                            value={formData.username_or_email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your email or username"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your password"
                        />
                        <div className="mt-2">
                            <p className="">Already have an account? <span className="text-blue-500 cursor-pointer hover:underline underline-offset-1" onClick={() => navigate('/auth/login')}>Login</span></p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Register
                    </button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>

                        <div className="relative flex justify-center">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Login Button */}
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