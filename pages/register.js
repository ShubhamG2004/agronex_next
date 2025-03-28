import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/layout/layout';
import Link from 'next/link';
import styles from '../styles/Form.module.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from 'formik';
import { register_validate } from '../lib/validate';

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
    validate: register_validate,
    onSubmit: async (values) => {
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
      }
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
          {formik.errors.username && formik.touched.username && <span className='text-rose-500'>{formik.errors.username}</span>}
          
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
          {formik.errors.email && formik.touched.email && <span className='text-rose-500'>{formik.errors.email}</span>}
          
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
          {formik.errors.password && formik.touched.password && <span className='text-rose-500'>{formik.errors.password}</span>}
          
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
          {formik.errors.confirmPassword && formik.touched.confirmPassword && <span className='text-rose-500'>{formik.errors.confirmPassword}</span>}
          
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
