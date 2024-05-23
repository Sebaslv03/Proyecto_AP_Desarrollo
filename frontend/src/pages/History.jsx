import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const History = () => {
    // Burnt data for purchased movies
    const burntPurchasedMovies = [
        {
            id: 1,
            image: "https://via.placeholder.com/150",
            title: "Movie Title 1",
            description: "Brief description of Movie Title 1.",
            duration: 120
        },
        {
            id: 2,
            image: "https://via.placeholder.com/150",
            title: "Movie Title 2",
            description: "Brief description of Movie Title 2.",
            duration: 110
        },
        {
            id: 3,
            image: "https://via.placeholder.com/150",
            title: "Movie Title 3",
            description: "Brief description of Movie Title 3.",
            duration: 130
        }
    ];

    // Burnt data for viewed products
    const burntViewedProducts = [
        {
            id: 1,
            image: "https://via.placeholder.com/150",
            title: "Viewed Product 1",
            description: "Brief description of Viewed Product 1.",
            duration: 100
        },
        {
            id: 2,
            image: "https://via.placeholder.com/150",
            title: "Viewed Product 2",
            description: "Brief description of Viewed Product 2.",
            duration: 90
        },
        {
            id: 3,
            image: "https://via.placeholder.com/150",
            title: "Viewed Product 3",
            description: "Brief description of Viewed Product 3.",
            duration: 95
        }
    ];

    const [purchasedMovies, setPurchasedMovies] = useState(burntPurchasedMovies);
    const [viewedProducts, setViewedProducts] = useState(burntViewedProducts);

    useEffect(() => {
        // Fetch purchased movies data from an API
        // Uncomment and replace with your API endpoint
        // axios.get('/api/purchased-movies')
        //     .then(response => setPurchasedMovies(response.data))
        //     .catch(error => console.error('Error fetching purchased movies:', error));

        // Fetch viewed products data from an API
        // Uncomment and replace with your API endpoint
        // axios.get('/api/viewed-products')
        //     .then(response => setViewedProducts(response.data))
        //     .catch(error => console.error('Error fetching viewed products:', error));
    }, []);

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <Header />
            <div className="container mx-auto py-4 px-4">
                <h2 className="text-4xl font-bold mb-6">Shopping History</h2>
                <div className="grid gap-6 mb-10">
                    {purchasedMovies.map((movie, index) => (
                        <div key={movie.id} className="bg-[#262626] rounded-md px-4 py-4 flex items-center">
                            <p className="text-xl font-semibold mr-4">{index + 1}.</p>
                            <img src={movie.image} alt={movie.title} className="h-24 w-16 rounded-md mr-4" />
                            <div>
                                <p className="text-xl font-semibold">{movie.title}</p>
                                <p className="text-[#757070] text-base font-thin">{movie.description}</p>
                                <p className="text-[#757070] text-sm">Duration: {movie.duration} minutes</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-4xl font-bold mb-6">Viewed Products</h2>
                <div className="grid gap-6">
                    {viewedProducts.map((product, index) => (
                        <div key={product.id} className="bg-[#262626] rounded-md px-4 py-4 flex items-center">
                            <p className="text-xl font-semibold mr-4">{index + 1}.</p>
                            <img src={product.image} alt={product.title} className="h-24 w-16 rounded-md mr-4" />
                            <div>
                                <p className="text-xl font-semibold">{product.title}</p>
                                <p className="text-[#757070] text-base font-thin">{product.description}</p>
                                <p className="text-[#757070] text-sm">Duration: {product.duration} minutes</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default History;