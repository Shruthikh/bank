import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Wallet, Globe, Smartphone, Clock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Basic validation
    if (!email.trim()) {
      setIsLoading(false);
      return;
    }

    if (!password) {
      setIsLoading(false);
      return;
    }
    
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setIsLoading(false);
    }
  };

  const bankServices = [
    {
      icon: <Wallet className="h-6 w-6 text-sky-600" />,
      title: "Personal Banking",
      description: "Checking, savings, and investment accounts tailored to your needs"
    },
    {
      icon: <Globe className="h-6 w-6 text-sky-600" />,
      title: "Global Access",
      description: "Bank from anywhere in the world with our digital services"
    },
    {
      icon: <Smartphone className="h-6 w-6 text-sky-600" />,
      title: "Mobile Banking",
      description: "Manage your finances on the go with our secure mobile app"
    },
    {
      icon: <Clock className="h-6 w-6 text-sky-600" />,
      title: "24/7 Banking",
      description: "Access your accounts and support anytime, anywhere"
    }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-50 to-sky-100">
      {/* Bank Information Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-sky-600 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <Building2 className="h-10 w-10" />
            <h1 className="text-3xl font-bold">SecureBank</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">Banking Made Simple</h2>
          <p className="text-lg text-sky-100 mb-12">
            Experience the convenience of modern banking with industry-leading security.
          </p>
          
          <div className="grid grid-cols-1 gap-8">
            {bankServices.map((service, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-2 bg-sky-500 rounded-lg">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <p className="text-sky-100">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-sky-200">
          2025 SecureBank. All rights reserved.
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Building2 className="mx-auto h-12 w-12 text-sky-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter your registered email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="text-sm text-center">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-sky-600 hover:text-sky-500">
                Create one now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}