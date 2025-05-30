import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function AuthForm({ onSubmit, formType, error }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username_or_email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div>
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault()
        onSubmit(formData)
      }}>
        <div>
          <label className="block font-medium text-gray-700">Email or Username</label>
          <input required
            type="text"
            name="username_or_email"
            value={formData.username_or_email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="email or username"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10"
              placeholder="password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="mt-2">
            <div className={`p-1 text-[13px] justify-center text-red-600 ${error ? 'flex translate-y-0 ' : 'hidden -translate-y-2'} transition-all duration-200`}>
              {error}
            </div>
            <p className="">
              {formType === 'login' ? (
                <>Don't have an account? <span className="text-purple cursor-pointer hover:underline underline-offset-1" onClick={() => navigate('/auth/register')}>Create one</span></>
              ) : (
                <>Already have an account? <span className="text-purple cursor-pointer hover:underline underline-offset-1" onClick={() => navigate('/auth/login')}>Login</span></>
              )}
            </p>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 px-4 rounded-md transition-colors duration-300  hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          {formType === 'login' ? 'Login' : 'Register'}
        </button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-gray-100 text-gray-500">Or continue with</span>
          </div>
        </div>


        {/* Google Login Button */}
        <button
          // onClick={handleLoginWithGoogle}
          disabled={true}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white border  rounded-md py-2 px-4 hover:bg-gray-50 hover:border-purple transition-colors  duration-300"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </form>
    </div>
  )
}