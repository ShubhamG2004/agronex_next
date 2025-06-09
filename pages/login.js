import React, { useState } from 'react';
import Layout from '@/layout/layout';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaArrowLeft } from "react-icons/fa";
import { signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import login_validate from '@/lib/validate';
import { useRouter } from 'next/router';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validate: login_validate,
        onSubmit: onSubmitHandler
    });

    async function onSubmitHandler(values) {
        setLoading(true);
        try {
            const status = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
                callbackUrl: '/'
            });

            if (status.ok) {
                router.push(status.url);
            } else {
                throw new Error(status.error || 'Login failed');
            }
        } catch (error) {
            console.error('❌ Login Failed:', error.message);
            // You might want to show this error to the user
        } finally {
            setLoading(false);
        }
    }

    async function handleOAuthSignIn(provider) {
        setLoading(true);
        try {
            await signIn(provider, { 
                callbackUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' 
            });
        } catch (error) {
            console.error(`❌ ${provider} Sign-In Failed:`, error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
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
                        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-10 flex flex-col justify-center">
                            <div className="text-white">
                                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                                <p className="text-indigo-100 mb-8">
                                    Sign in to access your personalized dashboard and continue your journey with us.
                                </p>
                                <div className="flex items-center justify-center">
                                    <div className="bg-white/20 p-6 rounded-full">
                                        {/* Replace with your logo or icon */}
                                        <div className="text-4xl">🔒</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="w-full md:w-1/2 p-10">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
                                <p className="text-gray-600">Access your account to continue</p>
                            </div>

                            {/* Login Form */}
                            <form className="space-y-6" onSubmit={formik.handleSubmit}>
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
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            id="password" 
                                            name="password" 
                                            placeholder="••••••••" 
                                            className={`w-full px-4 py-3 rounded-lg border ${formik.touched.password && formik.errors.password ? 
                                                'border-red-500 focus:ring-red-500' : 
                                                'border-gray-300 focus:ring-indigo-500'} focus:outline-none focus:ring-2`}
                                            autoComplete="current-password"
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

                                {/* Login Button */}
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
                                                Signing in...
                                            </span>
                                        ) : 'Sign in'}
                                    </button>
                                </div>
                            </form>

                            {/* Divider */}
                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>
                            </div>

                            {/* OAuth Buttons */}
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleOAuthSignIn('google')}
                                    disabled={loading}
                                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    <FaGoogle className="h-5 w-5 text-red-500" />
                                    <span className="ml-2">Google</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleOAuthSignIn('github')}
                                    disabled={loading}
                                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    <FaGithub className="h-5 w-5 text-gray-800" />
                                    <span className="ml-2">GitHub</span>
                                </button>
                            </div>

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center text-sm">
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                        Sign up
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