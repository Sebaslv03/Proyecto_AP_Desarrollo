import React from "react";
import { useState, useEffect } from "react";
import HeaderAlt from "../components/HeaderAlt";
import creditcard from "../images/creditcard.png";

const ShoppingCart = () => {
    // Burnt data for shopping cart movies
    const burntCartMovies = [
        {
            id: 1,
            image: "https://via.placeholder.com/150",
            title: "Cart Movie 1",
            description: "Brief description of Cart Movie 1.",
            duration: 125
        },
        {
            id: 2,
            image: "https://via.placeholder.com/150",
            title: "Cart Movie 2",
            description: "Brief description of Cart Movie 2.",
            duration: 140
        },
        {
            id: 3,
            image: "https://via.placeholder.com/150",
            title: "Cart Movie 3",
            description: "Brief description of Cart Movie 3.",
            duration: 115
        }
    ];

    const [cartMovies, setCartMovies] = useState(burntCartMovies);

    useEffect(() => {
        // Fetch cart movies data from an API
        // Uncomment and replace with your API endpoint
        // axios.get('/api/cart-movies')
        //     .then(response => setCartMovies(response.data))
        //     .catch(error => console.error('Error fetching cart movies:', error));
    }, []);

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <HeaderAlt />
            <div className="container mx-auto py-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <h2 className="text-4xl font-bold mb-6">Shopping Cart</h2>
                        <div className="grid gap-6 mb-10">
                            {cartMovies.map((movie, index) => (
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
                    </div>
                    <div className="md:col-span-1">
                        <h2 className="text-4xl font-bold mb-6">Order Summary</h2>
                        <div className="bg-[#262626] rounded-md px-4 py-4">
                            <p className="text-[#757070] text-base font-thin mb-4">Number of items: {cartMovies.length}</p>
                            <img src={creditcard} alt="Card Logo" className="h-12 w-auto mb-4" />
                            <div className="mb-4">
                                <label htmlFor="card-number" className="block text-white mb-2">Card Number</label>
                                <input type="text" id="card-number" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="owner-name" className="block text-white mb-2">Owner's Name</label>
                                <input type="text" id="owner-name" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
                            </div>
                            <div className="flex space-x-2 mb-4">
                                <div className="w-1/2">
                                    <label htmlFor="expiration-date" className="block text-white mb-2">Expiration Date</label>
                                    <input type="text" id="expiration-date" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="security-code" className="block text-white mb-2">Security Code</label>
                                    <input type="text" id="security-code" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <input type="checkbox" id="terms" className="mr-2" />
                                <label htmlFor="terms" className="text-white">I agree with the terms of use and privacy policy</label>
                            </div>
                            <button type="button" className="w-full p-2 rounded bg-[#e50914] text-white" onClick={() => window.location.href='/history'}>Pay</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;