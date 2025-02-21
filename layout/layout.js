import React from 'react';
import style from '../styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="m-auto bg-slate-50 rounded-md w-3/5 h-3/4 grid lg:grid-cols-2 items-stretch">
        
        {/* Left Section (Image) */}
        <div className={`${style.imgStyle} h-full flex items-center justify-center`}>
          <div className={style.agroLogo}></div>
        </div>

        {/* Right Section (Login Form) */}
        <div className="right h-full flex flex-col justify-evenly">
          <div className="text-center py-10">
            {children}
          </div>
        </div>
        
      </div>
    </div>
  );
}
