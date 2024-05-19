import React, { useEffect, useState } from 'react'
import image from '../images/logo.png'
import Header from '../components/Header';

const Login = () => {
  return (
    <div>
    <Header/>
    <div className="flex h-screen bg-[#1E1E1E] text-[18px]">
      <div className="flex-1 flex justify-center items-center">
        <img src={image} alt="Background" className="w-1/2 h-auto rounded" />
      </div>

      <div className="flex-1 flex flex-col justify-center p-8 text-white">
        <h1 class="text-5xl font-bold text-white mb-4">Forgot password?</h1>
        <p className="mb-6">
          Your password will be sent to your email        
        </p>
        <form >
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">Email: </label>
            <input type="text" id="username" placeholder="Enter your email" className="w-96 p-2 rounded bg-[#222] border border-[#333] text-white" />
          </div>
          <button type="submit" className="items-center w-80 p-2 rounded bg-[#e50914] text-white">Send password</button>
        </form>
        <a href="/ForgotPassword" className="block mt-4  text-white">Send password again</a>
        <a href="/" className="block mt-4  text-white">Go back to log in</a>
      </div>
    </div>
    </div>
  );
};

export default Login;
