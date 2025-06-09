import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/layout/layout';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useFormik } from 'formik';
import { register_validate } from '../lib/validate';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate: register_validate,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');

        alert(data.message);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Layout>
      <Head>
        <title>Register | Your App Name</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
            <FaArrowLeft className="mr-2" /> Back to home
          </Link>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Branding */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 flex flex-col justify-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">Join Us!</h2>
                <p className="text-indigo-100 mb-8">
                  Create your account to unlock all features and start your journey with us.
                </p>
                <div className="flex items-center justify-center">
                  <div className="bg-white/20 p-6 rounded-full">
                    <div className="text-4xl">✨</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 p-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                <p className="text-gray-600">Get started with just a few details</p>
              </div>

              {/* Registration Form */}
              <form className="space-y-5" onSubmit={formik.handleSubmit}>
                {/* Username Input */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    placeholder="johndoe" 
                    className={`w-full px-4 py-3 rounded-lg border ${formik.touched.username && formik.errors.username ? 
                      'border-red-500 focus:ring-red-500' : 
                      'border-gray-300 focus:ring-indigo-500'} focus:outline-none focus:ring-2`}
                    autoComplete="username"
                    {...formik.getFieldProps('username')}
                  />
                  {formik.errors.username && formik.touched.username && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.username}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="your@email.com" 
                    className={`w-full px-4 py-3 rounded-lg border ${formik.touched.email && formik.errors.email ? 
                      'border-red-500 focus:ring-red-500' : 
                      'border-gray-300 focus:ring-indigo-500'} focus:outline-none focus:ring-2`}
                    autoComplete="email"
                    {...formik.getFieldProps('email')}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      id="password" 
                      name="password" 
                      placeholder="••••••••" 
                      className={`w-full px-4 py-3 rounded-lg border ${formik.touched.password && formik.errors.password ? 
                        'border-red-500 focus:ring-red-500' : 
                        'border-gray-300 focus:ring-indigo-500'} focus:outline-none focus:ring-2`}
                      autoComplete="new-password"
                      {...formik.getFieldProps('password')}
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {formik.errors.password && formik.touched.password && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      placeholder="••••••••" 
                      className={`w-full px-4 py-3 rounded-lg border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 
                        'border-red-500 focus:ring-red-500' : 
                        'border-gray-300 focus:ring-indigo-500'} focus:outline-none focus:ring-2`}
                      autoComplete="new-password"
                      {...formik.getFieldProps('confirmPassword')}
                    />
                    <button 
                      type="button" 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                  )}
                </div>

                {/* Register Button */}
                <div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : 'Register'}
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}