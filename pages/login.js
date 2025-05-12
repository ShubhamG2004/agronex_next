import React, { useState } from 'react';
import Layout from '@/layout/layout';
import Link from 'next/link';
import styles from '../styles/Form.module.css';
import Image from 'next/image';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import login_validate from '@/lib/validate';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    
    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validate: login_validate,
        onSubmit: onSubmitHandler
    });

    async function onSubmitHandler(values) {
        setIsLoading(true);
        setError(null);
        
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
                setError(status.error || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleOAuthSignIn(provider) {
        setIsLoading(true);
        setError(null);
        
        try {
            await signIn(provider, { 
                callbackUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' 
            });
        } catch (err) {
            setError(`Failed to sign in with ${provider}. Please try again.`);
            setIsLoading(false);
        }
    }

    return (
        <Layout>
            <Head>
                <title>Login | Your App Name</title>
                <meta name="description" content="Login to access your account" />
            </Head>
            
            <section className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-gray-50">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                            <p className="text-gray-600">Sign in to access your account</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={formik.handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                                        formik.touched.email && formik.errors.email 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                                    }`}
                                    autoComplete="email"
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.errors.email && formik.touched.email && (
                                    <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                                            formik.touched.password && formik.errors.password 
                                                ? 'border-red-500 focus:ring-red-200' 
                                                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                                        }`}
                                        autoComplete="current-password"
                                        {...formik.getFieldProps('password')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {formik.errors.password && formik.touched.password && (
                                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 ${
                                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : 'Sign in'}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleOAuthSignIn('google')}
                                    disabled={isLoading}
                                    className="w-full inline-flex justify-center items-center py-3 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
                                >
                                    <FaGoogle className="h-5 w-5 text-red-500" />
                                    <span className="ml-2">Google</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleOAuthSignIn('github')}
                                    disabled={isLoading}
                                    className="w-full inline-flex justify-center items-center py-3 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
                                >
                                    <FaGithub className="h-5 w-5 text-gray-800" />
                                    <span className="ml-2">GitHub</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}