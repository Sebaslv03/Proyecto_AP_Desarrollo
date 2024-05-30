import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Plus, Play, ArrowRight, ArrowLeft, CirclePlus } from "lucide-react";
import Header from '../components/HeaderUser';
import { Button } from "@/components/ui/button";
import supabase from "../config/supabaseClient"

const HomePage = () => {
  const navigate = useNavigate();   
  const [currentIndex, setCurrentIndex] = useState({
    Principal: 0,
    Movies: 0,
    Shows: 0,
  });
  const [moviesPrincipal, setMoviesPrincipal] = useState([]);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  
  const categories = [
    { name: 'Movies', items: movies },
    { name: 'Shows', items: shows },
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const fetchData = async (tableName, setState, limit) => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(limit);
      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return [];
      }
      setState(data);
    };

    fetchData('movie', setMoviesPrincipal, 4); // Get top 4 movies
    fetchData('movie', setMovies);
    fetchData('show', setShows);
  };

  const handlePrevClick = (category) => {
    setCurrentIndex((prevState) => ({
      ...prevState,
      [category]: prevState[category] === 0 ? categories.find(cat => cat.name === category).items.length - 1 : prevState[category] - 1,
    }));
  };

  const handleNextClick = (category) => {
    setCurrentIndex((prevState) => ({
      ...prevState,
      [category]: prevState[category] === categories.find(cat => cat.name === category).items.length - 1 ? 0 : prevState[category] + 1,
    }));
  };

  const handleItemClick = (item, category) => {
    if (category.name === 'Movies') {
      navigate(`/Movie/${item.id}`);
    } else if (category.name === 'Shows') {
      navigate(`/Show/${item.id}`);
    }
  };


  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Header />

      <div className="flex justify-center w-full mt-8">
        <div className="relative" style={{ 
                    width: '1594px', 
                    height: '835px', 
                    backgroundImage: `url('${moviesPrincipal[currentIndex.Principal]?.photo}')`, 
                    backgroundSize: 'contain', 
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end items-center pb-16">
            <h1 className="text-4xl font-bold">{moviesPrincipal[currentIndex.Principal]?.title}</h1>
            <p className="mt-2 text-center max-w-lg">
              {moviesPrincipal[currentIndex.Principal]?.sinopsis}
            </p>
            <div className="flex justify-center mt-4 space-x-1">
              {moviesPrincipal.map((_, index) => (
                <div key={index} className={`h-2.5 mx-1 rounded-full ${index === currentIndex.Principal ? 'bg-red-600' : 'bg-gray-400'}`} style={{ width: index === currentIndex.Principal ? '40px' : '20px' }}></div>
              ))}
            </div>
          </div>
          <Button onClick={() => setCurrentIndex((prevState) => ({ ...prevState, Principal: prevState.Principal === 0 ? moviesPrincipal.length - 1 : prevState.Principal - 1 }))} variant="outline" className="absolute left-4 bottom-16 bg-black border-1 h-[56px] w-[56px]" size="icon">
            <ArrowLeft className="h-28px w-28px" />
          </Button>
          <Button onClick={() => setCurrentIndex((prevState) => ({ ...prevState, Principal: prevState.Principal === moviesPrincipal.length - 1 ? 0 : prevState.Principal + 1 }))} variant="outline" className='absolute right-4 bottom-16 w-[56px] h-[56px] bg-black border-1' size="icon">
            <ArrowRight className="h-28px w-28px" />
          </Button>
        </div>
      </div>

      <div className="mt-8 w-full max-w-screen-xl mx-auto flex flex-col items-center">
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="mb-8 w-[1532px] h-[587px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold pb-[20px]">{category.name}</h2>
            </div>
            <div className="relative">
              <div className="flex justify-center overflow-x-auto space-x-4">
                {category.items.slice(currentIndex[category.name], currentIndex[category.name] + 5).map((item, index) => (
                <div key={index} className="flex-shrink-0 w-[284px] h-[377px] bg-[#1A1A1A] p-2 rounded-[12px] cursor-pointer flex flex-col items-center justify-between" onClick={() => handleItemClick(item, category)}>
                    <img src={item.photo} alt={item.title} className="rounded mb-2 w-[243px] h-[281px]" />
                    {category.name === 'Movies' ? (<h3 className="text-center text-white pb-2">{item.title}</h3>) : (<h3 className="text-center text-white pb-2">{item.name}</h3>)}
                    <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">Released at {item.releaseDate}</p>
                </div>
                ))}
              </div>
              <div className="absolute right-0 flex items-center justify-center mr-6 mt-10 space-x-2">
                <Button onClick={() => handlePrevClick(category.name)} variant="outline" className="bg-black border-1 h-[56px] w-[56px]" size="icon">
                  <ArrowLeft className="h-28px w-28px" />
                </Button>
                {category.items.slice(0, 4).map((_, index) => (
                  <div key={index} className={`h-2.5 rounded-full ${index === currentIndex[category.name] % 4 ? 'bg-gray-400' : 'bg-red-600'}`} style={{ width: '20px' }}></div>
                ))}
                <Button onClick={() => handleNextClick(category.name)} variant="outline" className="bg-black border-1 h-[56px] w-[56px]" size="icon">
                  <ArrowRight className="h-28px w-28px" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
