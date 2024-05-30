import React from 'react';
import logo from '../images/logo.png';
import home from '../images/home.png';
import search from '../images/search.png';
import stats from '../images/stats.png';
import cast from '../images/person.png'
import catalog from '../images/catalog.png'

const HeaderAdmin = () => {
  return (
    <header className="bg-[#1E1E1E] py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="ShowSeeker Logo" className="h-12" />
          <h1 className="text-3xl font-bold ml-4 text-white">ShowSeeker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/AdminCatalog" className="text-white">
            <img src={catalog} alt="home" className="h-8" />
          </a>
          <a href="/StatsAdmin" className="text-white">
            <img src={stats} alt="stats" className="h-8" />
          </a>
          <a href="/SearchPageAdmin" className="text-white">
            <img src={search} alt="search" className="h-8" />
          </a>
          <a href="/HomePageAdmin" className="text-white">
            <img src={home} alt="home" className="h-8" />
          </a>
          
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;


