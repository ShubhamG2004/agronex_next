import React, { useState } from 'react';
import Layout from '@/layout/layout';
import Link from 'next/link';
import styles from '../styles/Form.module.css';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import login_validate from '@/lib/validate';
import { useRouter } from 'next/router';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    
    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validate: login_validate,
        onSubmit: onSubmitHandler
    });

    async function onSubmitHandler(values) {
        const status = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
            callbackUrl: '/'
        });

        if (status.ok) router.push(status.url);
        else console.error('❌ Login Failed:', status.error);
    }

    // Google Sign-In Handler
    async function handleGoogleSignIn() {
        await signIn('google', { callbackUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });
    }

    // GitHub Sign-In Handler
    async function handleGithubSignIn() {
        await signIn('github', { callbackUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });
    }

    return (
        <Layout>
            <section className="w-3/4 mx-auto flex flex-col gap-10">
                <div className="title">
                    <h1 className="text-3xl text-center">Login</h1>
                    <h2>Welcome Here!</h2>
                </div>

                {/* Login Form */}
                <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
                    {/* Email Input */}
                    <div className={`${styles.inputGroup} border ${formik.touched.email && formik.errors.email ? 'border-rose-600' : 'border-gray-300'}`}>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="Email" 
                            className={styles.input_text} 
                            autoComplete="email"
                            {...formik.getFieldProps('email')}
                        />
                    </div>
                    {formik.errors.email && formik.touched.email && <span className="text-rose-500">{formik.errors.email}</span>}

                    {/* Password Input */}
                    <div className={`${styles.inputGroup} ${formik.touched.password && formik.errors.password ? 'border-rose-600' : ''}`}>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            id="password" 
                            name="password" 
                            placeholder="Password" 
                            className={styles.input_text} 
                            autoComplete="current-password"
                            {...formik.getFieldProps('password')}
                        />
                        <span className="icon flex items-center px-4 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>
                            {showPassword ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
                        </span>
                    </div>
                    {formik.errors.password && formik.touched.password && <span className="text-rose-500">{formik.errors.password}</span>}

                    {/* Login Button */}
                    <div className="input-button">
                        <button type="submit" className={styles.button}>Login</button>
                    </div>
                    
                    <p>------ or continue with ------</p>

                    {/* Google Sign-In */}
                    <div className="input-button">
                        <button type="button" onClick={handleGoogleSignIn} className={styles.button_custom}>
                            Sign In with Google
                            <Image src="/assets/google.png" alt="Google logo" width={20} height={20} />
                        </button>
                    </div>

                    {/* GitHub Sign-In */}
                    <div className="input-button">
                        <button type="button" onClick={handleGithubSignIn} className={styles.button_custom}>
                            Sign In with GitHub
                            <Image src="/assets/github.png" alt="GitHub logo" width={20} height={20} />
                        </button>
                    </div>
                </form>

                {/* Sign Up Link (Fixed Link Issue) */}
                <div className="text-center">
                    <Link href="/register" className="underline text-blue-500">
                        Don't have an account? Sign Up
                    </Link>
                </div>

            </section>
        </Layout>
    );
}
