import React, { useState, useEffect } from 'react';
import HeaderAlt from "../components/HeaderAlt";

const Wishlist = () => {
    // Burnt data for wishlist movies
    const burntWishlistMovies = [
        {
            id: 1,
            image: "https://via.placeholder.com/150",
            title: "Wishlist Movie 1",
            description: "Brief description of Wishlist Movie 1.",
            duration: 125
        },
        {
            id: 2,
            image: "https://via.placeholder.com/150",
            title: "Wishlist Movie 2",
            description: "Brief description of Wishlist Movie 2.",
            duration: 140
        },
        {
            id: 3,
            image: "https://via.placeholder.com/150",
            title: "Wishlist Movie 3",
            description: "Brief description of Wishlist Movie 3.",
            duration: 115
        }
    ];

    const [wishlistMovies, setWishlistMovies] = useState(burntWishlistMovies);

    useEffect(() => {
        // Fetch wishlist movies data from an API
        // Uncomment and replace with your API endpoint
        // axios.get('/api/wishlist-movies')
        //     .then(response => setWishlistMovies(response.data))
        //     .catch(error => console.error('Error fetching wishlist movies:', error));
    }, []);

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <HeaderAlt />
            <div className="container mx-auto py-4 px-4">
                <h2 className="text-4xl font-bold mb-6">Wishlist</h2>
                <div className="grid gap-6">
                    {wishlistMovies.map((movie, index) => (
                        <div key={movie.id} className="bg-[#262626] rounded-md px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <p className="text-xl font-semibold mr-4">{index + 1}.</p>
                                <img src={movie.image} alt={movie.title} className="h-24 w-16 rounded-md mr-4" />
                                <div>
                                    <p className="text-xl font-semibold">{movie.title}</p>
                                    <p className="text-[#757070] text-base font-thin">{movie.description}</p>
                                    <p className="text-[#757070] text-sm">Duration: {movie.duration} minutes</p>
                                </div>
                            </div>
                            <button type="button" className="p-2 rounded bg-[#e50914] text-white">Add to Cart</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;