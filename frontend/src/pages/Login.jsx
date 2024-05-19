import React, { useEffect, useState } from 'react'
import logo from '../images/logo.png'
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
        <h1 class="text-5xl font-bold text-white mb-4">Welcome!</h1>
        <p className="mb-6">
          Log in to enjoy more of ShowSeeker and discover extended functionalities.
        </p>
        <form >
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">Username</label>
            <input type="text" id="username" placeholder="Enter your username" className="w-96 p-2 rounded bg-[#222] border border-[#333] text-white" />
          </div>
          <div className="mb-4 ">
            <label htmlFor="password" className="block mb-2">Password</label>
            <input type="password" id="password" placeholder="Enter your password" className=" w-96 p-2 rounded bg-[#222] border border-[#333] text-white" />
          </div>
          <button type="submit" className="items-center w-80 p-2 rounded bg-[#e50914] text-white">Log In</button>
        </form>
        <a href="/ForgotPassword" className="block mt-4  text-white">Forgot Password?</a>
        <p className="mt-4 ">
          No Account? <a href="/Register" className="text-[#e50914]">Create One!</a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Login;
