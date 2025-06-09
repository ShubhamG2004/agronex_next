import React, { useState } from 'react';
import Layout from '@/layout/layout';
import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
    onSubmit: onSubmitHandler,
  });

  async function onSubmitHandler(values) {
    const status = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: '/',
    });

    if (status.ok) router.push(status.url);
    else console.error('❌ Login Failed:', status.error);
  }

  async function handleGoogleSignIn() {
    await signIn('google', { callbackUrl: '/' });
  }

  async function handleGithubSignIn() {
    await signIn('github', { callbackUrl: '/' });
  }

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-[95%] max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Section */}
         <div className="hidden md:flex bg-green-600 text-white flex-col justify-center items-center p-10">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-lg text-center max-w-sm">
                Login to access your dashboard and explore powerful features.
            </p>
            <Image
                src="/assets/logo.png"
                alt="Login Illustration"
                width={250}
                height={250}
                className="mt-8"
            />
        </div>

          {/* Right Section */}
          <div className="p-10">
            <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Login</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...formik.getFieldProps('email')}
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="text-sm text-red-600 mt-1">{formik.errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...formik.getFieldProps('password')}
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
                {formik.errors.password && formik.touched.password && (
                  <p className="text-sm text-red-600 mt-1">{formik.errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
              >
                Login
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <hr className="flex-1 border-gray-300" />
                or continue with
                <hr className="flex-1 border-gray-300" />
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 border py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <Image src="/assets/google.png" alt="Google" width={20} height={20} />
                <span className="text-sm text-gray-700 font-medium">Sign in with Google</span>
              </button>

              {/* GitHub Sign-In */}
              <button
                type="button"
                onClick={handleGithubSignIn}
                className="w-full flex items-center justify-center gap-3 border py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <Image src="/assets/github.png" alt="GitHub" width={20} height={20} />
                <span className="text-sm text-gray-700 font-medium">Sign in with GitHub</span>
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
