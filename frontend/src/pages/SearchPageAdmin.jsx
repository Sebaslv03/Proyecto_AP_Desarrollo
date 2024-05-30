import React, { useState, useEffect } from 'react';
import HeaderUser from '../components/HeaderAdmin';
import { Button } from "@/components/ui/button";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [searchText, setSearchText] = useState('');
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [actors, setActors] = useState([]);
  const [directors, setDirectors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const moviesResponse = await supabase.from('movie').select('*');
    const actorsResponse = await supabase.from('actor').select('*');
    const directorsResponse = await supabase.from('director').select('*');
    const showResponse = await supabase.from('show').select('*');

    if (moviesResponse.error || actorsResponse.error || directorsResponse.error || showResponse.error) {
      console.error('Error fetching data:', moviesResponse.error || actorsResponse.error || directorsResponse.error || showResponse.error);
    } else {
      setMovies(moviesResponse.data);
      setActors(actorsResponse.data);
      setDirectors(directorsResponse.data);
      setShows(showResponse.data);
    }
  };

  const handleItemClick = (item, type) => {
    switch (type) {
      case 'Movie':
        navigate(`/EditMovie/${item.id}`);
        break;
      case 'Show':
        navigate(`/EditShow/${item.id}`);
        break;
      case 'Actor':
        navigate(`/EditActor/${item.id}/actor`);
        break;
      case 'Director':
        navigate(`/EditDirector/${item.id}/director`);
        break;
      default:
        console.log('Unknown type:', type);
    }
  };

  const handleTopAdmin = () => {
    navigate('/TopProductsAdmin')
  }

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredActors = actors.filter(actor =>
    `${actor.name} ${actor.lastName}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredDirectors = directors.filter(director =>
    `${director.name} ${director.lastName}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredShows = shows.filter(show =>
    show.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <HeaderUser />
      <div className="container mx-auto mt-8">
        <div className="flex justify-left mb-8">
          <input
            type="text"
            placeholder="Search movies, actors, directors..."
            className="p-2 rounded-[8px] border-2 border-[#262626] placeholder-[#99999] bg-[#141414] text-[#999999] text-[20px] w-[572px] h-[98px] max-w-md"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button onClick={handleTopAdmin} className="bg-[#E50000] border-1 h-[63px] w-[213px] hover:bg-[#E50000] ml-10 mt-4">Top Movies</Button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 w-[1498px]">
            {filteredMovies.map((movie, index) => (
              <div key={index} className="flex-shrink-0 w-[284px] h-[377px] bg-[#1A1A1A] p-2 rounded-[12px] cursor-pointer flex flex-col items-center justify-between" onClick={() => handleItemClick(movie, 'Movie')}>
                <img src={movie.photo} alt={movie.title} className="rounded mb-2 w-[243px] h-[281px]" />
                <h3 className="text-center text-white pb-2">{movie.title}</h3>
                <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">Released at {movie.releaseDate}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Shows</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 w-[1498px]">
            {filteredShows.map((show, index) => (
              <div key={index} className="flex-shrink-0 w-[284px] h-[377px] bg-[#1A1A1A] p-2 rounded-[12px] cursor-pointer flex flex-col items-center justify-between" onClick={() => handleItemClick(show, 'Show')}>
                <img src={show.photo} alt={show.name} className="rounded mb-2 w-[243px] h-[281px]" />
                <h3 className="text-center text-white pb-2">{show.name}</h3>
                <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">Released at {show.releaseDate}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Actors</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 w-[1498px]">
            {filteredActors.map((actor, index) => (
              <div key={index} className="flex-shrink-0 w-[284px] h-[377px] bg-[#1A1A1A] p-2 rounded-[12px] cursor-pointer flex flex-col items-center justify-between" onClick={() => handleItemClick(actor, 'Actor')}>
                <img src={actor.photo} alt={actor.name} className="rounded mb-2 w-[243px] h-[281px]" />
                <h3 className="text-center text-white pb-2">{actor.name} {actor.lastName}</h3>
                <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">Date of Birth: {actor.dateOfBirth}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Directors</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 w-[1498px]">
            {filteredDirectors.map((director, index) => (
              <div key={index} className="flex-shrink-0 w-[284px] h-[377px] bg-[#1A1A1A] p-2 rounded-[12px] cursor-pointer flex flex-col items-center justify-between" onClick={() => handleItemClick(director, 'Director')}>
                <img src={director.photo} alt={director.name} className="rounded mb-2 w-[243px] h-[281px]" />
                <h3 className="text-center text-white pb-2">{director.name} {director.lastName}</h3>
                <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">Date of Birth: {director.dateOfBirth}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
