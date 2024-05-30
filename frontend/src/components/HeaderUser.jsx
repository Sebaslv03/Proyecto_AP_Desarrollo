import React from 'react';
import logo from '../images/logo.png';
import home from '../images/home.png';
import profilepic from '../images/profilepic.png';
import heart from '../images/heart.png';
import cart from '../images/cart.png';
import search from '../images/search.png';

const HeaderUser = () => {
  return (
    <header className="bg-[#1E1E1E] py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/HomePage" className="text-white">
            <img src={logo} alt="ShowSeeker Logo" className="h-12" />
          </a>
          <h1 className="text-3xl font-bold ml-4 text-white">ShowSeeker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/SearchPage" className="text-white">
            <img src={search} alt="search" className="h-8" />
          </a>
          <a href="/HomePage" className="text-white">
            <img src={home} alt="home" className="h-8" />
          </a>
          <a href="/PersonalInfo" className="text-white">
            <img src={profilepic} alt="profile" className="h-8" />
          </a>
          <a href="/Wishlist" className="text-white">
            <img src={heart} alt="heart" className="h-8" />
          </a>
          <a href="/ShoppingCart" className="text-white">
            <img src={cart} alt="cart" className="h-8" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default HeaderUser;