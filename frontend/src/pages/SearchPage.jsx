import React, { useState } from 'react';
import HeaderUser from '../components/HeaderUser';
import { Button } from "@/components/ui/button"



const movies = [
  { title: 'Adipurush', releaseDate: '14 April 2023', image: 'https://www.infobae.com/new-resizer/zpbKsaWPnAABW5OVSJqg1J5E5G0=/1440x810/filters:format(webp):quality(85)/s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2019/04/24133716/avengers-endgame-22.jpg' },
  { title: 'Sin City', releaseDate: '15 April 2023', image: 'path-to-image2.jpg' },
  { title: 'Tomorrow War', releaseDate: '19 April 2023', image: 'path-to-image3.jpg' },
  { title: 'Misfire', releaseDate: '11 April 2023', image: 'path-to-image4.jpg' },
  { title: 'Adipurush', releaseDate: '14 April 2023', image: 'https://www.infobae.com/new-resizer/zpbKsaWPnAABW5OVSJqg1J5E5G0=/1440x810/filters:format(webp):quality(85)/s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2019/04/24133716/avengers-endgame-22.jpg' },
  { title: 'Sin City', releaseDate: '15 April 2023', image: 'path-to-image2.jpg' },
  { title: 'Tomorrow War', releaseDate: '19 April 2023', image: 'path-to-image3.jpg' },
  { title: 'Misfire', releaseDate: '11 April 2023', image: 'path-to-image4.jpg' },
  { title: 'Adipurush', releaseDate: '14 April 2023', image: 'https://www.infobae.com/new-resizer/zpbKsaWPnAABW5OVSJqg1J5E5G0=/1440x810/filters:format(webp):quality(85)/s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2019/04/24133716/avengers-endgame-22.jpg' },
  { title: 'Sin City', releaseDate: '15 April 2023', image: 'path-to-image2.jpg' },
  { title: 'Tomorrow War', releaseDate: '19 April 2023', image: 'path-to-image3.jpg' },
  { title: 'Misfire', releaseDate: '11 April 2023', image: 'path-to-image4.jpg' },
];

const SearchPage = () => {
  const [searchText, setSearchText] = useState('');

  const handleItemClick = (movie) => {
    console.log('Movie clicked:', movie);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <HeaderUser />
      <div className="container mx-auto mt-8">
        <div className="flex justify-left mb-8">
          <input
            type="text"
            placeholder="Search movies..."
            className="p-2 rounded-[8px] border-2 border-[#262626] placeholder-[#99999] bg-[#141414] text-[#999999] text-[20px] w-[572px] h-[98px] max-w-md"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button className="bg-[#E50000] border-1 h-[63px] w-[213px] hover:bg-[#E50000] ml-10 mt-4">Top Movies</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 w-[1498px]">
          {filteredMovies.map((movie, index) => (
            <div key={index} className="flex-shrink-0 w-[284px] h-[377px] bg-[#1A1A1A] p-2 rounded-[12px] cursor-pointer flex flex-col items-center justify-between" onClick={() => handleItemClick(movie)}>
              <img src={movie.image} alt={movie.title} className="rounded mb-2 w-[243px] h-[281px]" />
              <h3 className="text-center text-white pb-2">{movie.title}</h3>
              <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">Released at {movie.releaseDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;