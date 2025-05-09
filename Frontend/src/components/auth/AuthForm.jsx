import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthForm({ onSubmit, formType }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username_or_email: '',
    password: ''
  })

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
            placeholder="Enter your email or username"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Password</label>
          <input required
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your password"
          />
          <div className="mt-2">
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