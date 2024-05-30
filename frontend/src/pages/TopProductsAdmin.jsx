import React, { useState, useEffect } from 'react';
import HeaderUser from '../components/HeaderAdmin';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabase from "../config/supabaseClient";
import { useNavigate } from 'react-router-dom';
import { getYear } from 'date-fns';

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]);
    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        fetchData();
        fetchFilters();
    }, [selectedGenre, selectedYear]);

    const fetchFilters = async () => {
        const { data: genresData, error: genresError } = await supabase.from('category').select('*');
        const { data: yearsData, error: yearsError } = await supabase.from('movie').select('releaseDate');
    
        if (genresError || yearsError) {
            console.error('Error fetching filters:', genresError || yearsError);
        } else {
            const uniqueYears = [...new Set(yearsData.map(movie => getYear(new Date(movie.releaseDate))))];
            uniqueYears.sort((a, b) => a - b); // Ordenar los años de forma ascendente
            setGenres(genresData);
            setYears(uniqueYears);
        }
    };

    const fetchData = async () => {
        const { data: moviesData, error: moviesError } = await supabase.from('movie').select('*');
        const { data: showsData, error: showsError } = await supabase.from('show').select('*');

        if (moviesError || showsError) {
            console.error('Error fetching movies or shows:', moviesError || showsError);
            return;
        }

        const movieIDs = moviesData.map(movie => movie.id);
        const showIDs = showsData.map(show => show.id);

        const { data: movieCategories, error: movieCategoriesError } = await supabase
            .from('movieXcategory')
            .select('idMovie, idCategory')
            .in('idMovie', movieIDs);

        const { data: showCategories, error: showCategoriesError } = await supabase
            .from('showXcategory')
            .select('idShow, idCategory')
            .in('idShow', showIDs);

        if (movieCategoriesError || showCategoriesError) {
            console.error('Error fetching categories:', movieCategoriesError || showCategoriesError);
            return;
        }

        const categoryIDs = [...new Set([...movieCategories.map(cat => cat.idCategory), ...showCategories.map(cat => cat.idCategory)])];

        const { data: categories, error: categoriesError } = await supabase
            .from('category')
            .select('*')
            .in('id', categoryIDs);

        if (categoriesError) {
            console.error('Error fetching category names:', categoriesError);
            return;
        }

        const moviesWithCategories = moviesData.map(movie => ({
            ...movie,
            categories: movieCategories
                .filter(cat => cat.idMovie === movie.id)
                .map(cat => categories.find(category => category.id === cat.idCategory)?.nombre)
        }));

        const showsWithCategories = showsData.map(show => ({
            ...show,
            categories: showCategories
                .filter(cat => cat.idShow === show.id)
                .map(cat => categories.find(category => category.id === cat.idCategory)?.nombre)
        }));

        setMovies(moviesWithCategories);
        setShows(showsWithCategories);
    };

    const handleItemClick = async (item) => {
        try {
            const { data: movieData, error: movieError } = await supabase
                .from('movie')
                .select('id, title')
                .eq('id', item.id)
                .eq('title', item.title)
                .single();

            if (movieError) {
                console.error('Error fetching movie:', movieError);
            } else if (movieData) {
                navigate(`/EditMovie/${item.id}`);
                return;
            }

            const { data: showData, error: showError } = await supabase
                .from('show')
                .select('id, name')
                .eq('id', item.id)
                .eq('name', item.title)
                .single();

            if (showError) {
                console.error('Error fetching show:', showError);
            } else if (showData) {
                navigate(`/EditShow/${item.id}`);
                return;
            }

            console.error('No matching movie or show found.');
        } catch (error) {
            console.error('Error handling item click:', error);
        }
    };

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedGenre ? movie.categories.includes(selectedGenre) : true) &&
        (selectedYear ? getYear(new Date(movie.releaseDate)).toString() === selectedYear : true)
    );

    const filteredShows = shows.filter(show =>
        show.name.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedGenre ? show.categories.includes(selectedGenre) : true) &&
        (selectedYear ? getYear(new Date(show.releaseDate)).toString() === selectedYear : true)
    );
    

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <HeaderUser />
            <div className="container mx-auto mt-8">
                <div className="flex justify-left mb-8">
                    <Input
                        type="text"
                        placeholder="Search movies, actors, directors..."
                        className="p-2 rounded-[8px] border-2 border-[#262626] placeholder-[#99999] bg-[#141414] text-[#999999] text-[20px] w-[572px] h-[98px] max-w-md"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <div className="flex space-x-4 mb-8">
                    <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="p-2 rounded-[8px] bg-[#141414] text-[#999999]">
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.nombre}>{genre.nombre}</option>
                        ))}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 rounded-[8px] bg-[#141414] text-[#999999]">
                        <option value="">All Years</option>
                        {years.map((year, index) => (
                            <option key={index} value={year}>{year + 1}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Movies</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 w-[1498px]">
                        {filteredMovies.map((movie, index) => (
                            <div key={index} className="flex-shrink-0 w-[284px] h-[477px] bg-[#1A1A1A] p-2 rounded-[12px] cursor-pointer flex flex-col items-center justify-between" onClick={() => handleItemClick(movie)}>
                                <img src={movie.photo} alt={movie.title} className="rounded mb-2 w-[243px] h-[281px]" />
                                <h3 className="text-center text-white pb-2">{movie.title}</h3>
                                <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">Released at {movie.releaseDate}</p>
                                <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">Genres: {movie.categories.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Shows</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 w-[1498px]">
                        {filteredShows.map((show, index) => (
                            <div key={index} className="flex-shrink-0 w-[284px] h-[377px] bg-[#1A1A1A] p-2 rounded-[12px] cursor-pointer flex flex-col items-center justify-between" onClick={() => handleItemClick(show)}>
                                <img src={show.photo} alt={show.name} className="rounded mb-2 w-[243px] h-[281px]" />
                                <h3 className="text-center text-white pb-2">{show.name}</h3>
                                <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">Released at {show.releaseDate}</p>
                                <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">Genres: {show.categories.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
