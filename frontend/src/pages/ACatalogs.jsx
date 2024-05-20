import React from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import addimage from '../images/add.png'

const Catalogs = () => {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <HeaderAdmin />

      <div className="container mx-auto py-10 px-4">
        <h2 className="text-center text-4xl font-bold mb-10">Catalogs</h2>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <input type="text" placeholder="Add new catalog" className="p-2 rounded bg-[#222] w-96 border border-[#333] text-white" />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <img src={addimage} alt="add" className="h-6" />
            </button>
          </div>
        </div>   
        
        <div className="flex justify-center space-x-4 mb-8">
            <div>
                <label htmlFor="catalog" className="block text-lg font-semibold mb-2">Choose a catalog:</label>
                <select id="catalog" className="p-2 rounded bg-[#222] border border-[#333] text-white">
                <option value="Nationality">Nationality</option>
                </select>
            </div>    
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <input type="text" placeholder="Add new item to the catalog" className="p-2 rounded bg-[#222] w-96 border border-[#333] text-white" />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <img src={addimage} alt="add" className="h-6" />
            </button>
          </div>
        </div>

        <div className="flex justify-center grid gap-4">
          {['Monaco', 'Costa Rica', 'Cuba', 'Haiti', 'Iceland'].map((country, index) => (
            <div key={index} className="bg-[#333] w-96 p-4 rounded text-center">
              {country}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalogs;
