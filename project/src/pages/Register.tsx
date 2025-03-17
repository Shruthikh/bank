import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Shield, Award, Users, Landmark } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();
    
    // Validate password length
    if (password.length <= 5) {
      setPasswordError('Password must be more than 5 characters');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await register(email, password, name);
      if (result.success) {
        toast.success('Account created successfully! Please login to continue.');
        navigate('/login');
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length > 0 && newPassword.length <= 5) {
      setPasswordError('Password must be more than 5 characters');
    } else {
      setPasswordError('');
    }
  };

  const bankFeatures = [
    {
      icon: <Shield className="h-6 w-6 text-sky-600" />,
      title: "Secure Banking",
      description: "State-of-the-art security measures to protect your finances"
    },
    {
      icon: <Award className="h-6 w-6 text-sky-600" />,
      title: "Award-Winning Service",
      description: "24/7 customer support and personalized banking solutions"
    },
    {
      icon: <Users className="h-6 w-6 text-sky-600" />,
      title: "Community Focus",
      description: "Supporting local communities since 1990"
    },
    {
      icon: <Landmark className="h-6 w-6 text-sky-600" />,
      title: "FDIC Insured",
      description: "Your deposits are protected up to $250,000"
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
          <h2 className="text-4xl font-bold mb-6">Welcome to the Future of Banking</h2>
          <p className="text-lg text-sky-100 mb-12">
            Join millions of satisfied customers who trust us with their financial journey.
          </p>
          
          <div className="grid grid-cols-1 gap-8">
            {bankFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-2 bg-sky-500 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sky-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-sky-200">
          2025 SecureBank. All rights reserved.
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Building2 className="mx-auto h-12 w-12 text-sky-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us to start banking smarter
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                placeholder="Enter your full name"
              />
            </div>

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
                placeholder="Enter your email"
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
                onChange={handlePasswordChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  passwordError ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
                placeholder="Create a strong password (more than 5 characters)"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {error && (
              <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="text-sm text-center">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}