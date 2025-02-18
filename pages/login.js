import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/layout/layout';
import Link from 'next/link';
import styles from '../styles/Form.module.css';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from 'next-auth/react';
import { useFormik } from 'formik';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const formik = useFormik({
        initialValues: {
                email: '',
                password:''
        },
        validate : () =>{
            
        },
        onSubmit: onSubmitHandler
    });

    async function onSubmitHandler(values) {
        console.log(values);
    }

    // Google Sign-In Handler
    async function handleGoogleSignIn() {
        signIn('google', { callbackUrl: 'http://localhost:3000' });
    }
    async function handleGithubSignIn() {
        signIn('github', { callbackUrl: 'http://localhost:3000' });
    }
    return (
        <Layout>
            <section className='w-3/4 mx-auto flex flex-col gap-10'>
                <div className='title'>
                    <h1 className='text-3xl text-center'>Login</h1>
                    <h2>Welcome Here!</h2>
                </div>
                 
                {/* Login Form */}
                <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input 
                            type='email' 
                            id='email' 
                            name='email' 
                            placeholder='Email' 
                            className={styles.input_text} 
                            autoComplete='email'
                            aria-label='Email'
                            {...formik.getFieldProps('email')}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            id='password' 
                            name='password' 
                            placeholder='Password' 
                            className={styles.input_text} 
                            autoComplete='current-password'
                            aria-label='Password'
                            {...formik.getFieldProps('password')}
                        />
                        <span 
                            className='icon flex items-center px-4 cursor-pointer'
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <FaEyeSlash size={25}/> : <FaEye size={25}/>}
                        </span>
                    </div>

                    {/* Login Button */}
                    <div className='input-button'>
                        <button type="submit" className={styles.button}>Login</button>
                    </div>

                    {/* Google Sign-In */}
                    <div className='input-button'>
                        <button type="button" onClick={handleGoogleSignIn} className={styles.button_custom}>
                            Sign In with Google
                            <Image src={'/assets/google.png'} alt='Google logo' width={20} height={20} />
                        </button>
                    </div>

                    {/* GitHub Sign-In */}
                    <div className='input-button'>
                        <button type="button" onClick={handleGithubSignIn} className={styles.button_custom}>
                            Sign In with GitHub
                            <Image src={'/assets/github.png'} alt='GitHub logo' width={20} height={20} />
                        </button>
                    </div>
                </form>

                <div className='text-center '>
                    <Link href='/register'>
                        Don't have an account? <span className='underline text-blue-500'>Sign Up</span>
                    </Link>
                </div>
            </section>
        </Layout>
    );
}
