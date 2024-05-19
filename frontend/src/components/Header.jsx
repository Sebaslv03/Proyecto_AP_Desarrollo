import React from 'react';
import logo from '../images/logo.png';

const Header = () => {
  return (
    <header className="bg-[#1E1E1E] text-white py-6">
      <div className="flex items-center pl-4">
        <div className="flex-shrink-0">
          <img src={logo} alt="logo" className="h-12" />
        </div>
        <div className="ml-4 text-2xl font-bold">
          ShowSeeker
        </div>
      </div>
    </header>
  );
};

export default Header;

