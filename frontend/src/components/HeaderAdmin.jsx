import React from 'react';
import logo from '../images/logo.png';
import home from '../images/home.png';
import search from '../images/search.png';
import stats from '../images/stats.png';

const HeaderAdmin = () => {
  return (
    <header className="bg-[#1E1E1E] py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="ShowSeeker Logo" className="h-12" />
          <h1 className="text-3xl font-bold ml-4 text-white">ShowSeeker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <img src={stats} alt="stats" className="h-8" />
          </button>
          <button className="text-white">
            <img src={search} alt="search" className="h-8" />
          </button>
          <button className="text-white">
            <img src={home} alt="home" className="h-8" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;

