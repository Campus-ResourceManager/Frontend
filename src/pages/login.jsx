import React, { useState } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function LoginPage() {
  const { user, login, isLoggingIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    console.log('LoginPage: User exists, redirecting to dashboard');
    return <Redirect to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    console.log('LoginPage: Submitting form...');
    try {
      await login({ username, password });
      console.log('LoginPage: Login successful, should redirect automatically');
    } catch (err) {
      console.error('LoginPage: Login failed:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#90243A]">Login</h2>
          <p className="text-gray-600 mt-2">Enter your credentials</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#90243A] focus:border-transparent"
              placeholder="Enter username"
              required
              disabled={isLoggingIn}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#90243A] focus:border-transparent"
              placeholder="Enter password"
              required
              disabled={isLoggingIn}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 px-4 bg-[#90243A] text-white font-semibold rounded-lg hover:bg-[#7a1e30] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'Login'}
          </button>
        </form>
        
        <div className="text-center text-sm text-gray-500">
         
        </div>
      </div>
    </div>
  );
}