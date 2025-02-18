import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/layout/layout';
import Link from 'next/link';
import styles from '../styles/Form.module.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from 'formik';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: values => {
      console.log(values);
    }
  });

  return (
    <Layout>
      <Head>
        <title>Register</title>
      </Head>

      <section className='w-3/4 mx-auto flex flex-col gap-10'>
        {/* Title */}
        <div className='title text-center'>
          <h1 className='text-3xl'>Register</h1>
          <h2>Welcome Here!</h2>
        </div>

        {/* Form */}
        <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
          <div className={styles.inputGroup}>
            <input 
              type='text' 
              id='username' 
              name='username' 
              placeholder='Username' 
              className={styles.input_text} 
              autoComplete='username'
              aria-label='Username'
              {...formik.getFieldProps('username')}
            />
          </div>
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
              autoComplete='new-password'
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
          <div className={styles.inputGroup}>
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              id='confirmPassword' 
              name='confirmPassword' 
              placeholder='Confirm Password' 
              className={styles.input_text} 
              autoComplete='new-password'
              aria-label='Confirm Password'
              {...formik.getFieldProps('confirmPassword')}
            />
            <span 
              className='icon flex items-center px-4 cursor-pointer'
              onClick={() => setShowConfirmPassword(prev => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash size={25}/> : <FaEye size={25}/>}
            </span>
          </div>

          <div className='input-button'>
            <button type="submit" className={styles.button}>Register</button>
          </div>
        </form>

        {/* Login Link */}
        <div className='text-center'>
          <Link href='/login'>
            Already have an account? <span className='underline text-blue-500'>Login</span>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
