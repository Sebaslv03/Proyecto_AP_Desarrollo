import React, { useEffect, useState } from 'react'
import image from '../images/profilepic.png'
import Header from '../components/Header';


const PersonalInfo = () => {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Header/>
      <div className="container mx-auto py-10 px-4">
        <h2 className="text-center text-4xl font-bold mb-10">Personal Information</h2>
        
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <label htmlFor="photo-upload" className="block mb-2 cursor-pointer">
              <img src={image} alt="Add Photo" className="h-40 w-40 mx-auto rounded-full" />
            </label>
            <input type="file" id="photo-upload" className="hidden" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="name" className="block mb-2">Name</label>
            <input type="text" id="name" placeholder="Enter Name" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
          </div>
          <div>
            <label htmlFor="first-last-name" className="block mb-2">First Last Name</label>
            <input type="text" id="first-last-name" placeholder="Enter First Last Name" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
          </div>
          <div>
            <label htmlFor="second-last-name" className="block mb-2">Second Last Name</label>
            <input type="text" id="second-last-name" placeholder="Enter Second Last Name" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
          </div>
          <div>
            <label htmlFor="nationality" className="block mb-2">Nationality</label>
            <select id="nationality" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white">
              <option value="Costa Rica">Costa Rica</option>
              {/* Agrega más opciones según sea necesario */}
            </select>
          </div>
          <div>
            <label htmlFor="id" className="block mb-2">ID or passport</label>
            <input type="text" id="id" placeholder="Enter ID or passport" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
          </div>
          <div>
            <label htmlFor="community" className="block mb-2">Community</label>
            <input type="text" id="community" placeholder="Enter your community" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
          </div>
          <div>
            <label htmlFor="birthdate" className="block mb-2">Birthdate</label>
            <div className="flex space-x-2">
              <select id="birthdate-month" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white">
                <option value="mm">mm</option>
                {/* Agrega más opciones según sea necesario */}
              </select>
              <select id="birthdate-day" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white">
                <option value="dd">dd</option>
                {/* Agrega más opciones según sea necesario */}
              </select>
              <select id="birthdate-year" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white">
                <option value="yyyy">yyyy</option>
                {/* Agrega más opciones según sea necesario */}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="phone-number" className="block mb-2">Phone Number</label>
            <div className="flex space-x-2">
              <input type="text" id="phone-number" placeholder="Enter Phone Number" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block mb-2">Email</label>
            <input type="email" id="email" placeholder="Enter your email" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2">Password</label>
            <input type="password" id="password" placeholder="Enter your password" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
          </div>
          <div>
            <div className="flex justify-left mt-8">
            <button type="submit" className="w-40 max-w-xs p-2 rounded bg-[#e50914] text-white"> View my history</button>
            </div>          
          </div>
        </div>


        <div className="flex justify-center mt-8">
          <button type="submit" className="w-full max-w-xs p-2 rounded bg-[#e50914] text-white"> Save changes</button>
        </div>

        <div className="text-center mt-4">
          <p> <a href="/" className="text-white">Go back to main</a></p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
