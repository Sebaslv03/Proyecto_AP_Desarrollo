import React from 'react';
import { useState } from 'react';
import Header from '../components/Header';

const ActorScreenUser = () => {
    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <Header />
            <div className="container mx-auto py-4 px-4">
                <div className='flex flex-col items-center my-3'>
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Jim_Carrey_2008.jpg/640px-Jim_Carrey_2008.jpg" // Replace with the actual image URL
                        alt="Actor" 
                        className="h-209 w-130 mx-auto rounded-md" 
                    />
                    <p className='text-xl font-semibold my-3'>Jim Carrey</p> {/*Actor name */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 items-start">
                    <div className="grid grid-cols-1 col-span-1 md:col-span-2 gap-6 items-center">
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className="text-white">Biography</h5>
                            <p className="text-[#757070] text-base font-thin">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className="text-white">Trivia</h5>
                            <ul className="list-disc list-inside text-[#757070] text-base font-thin">
                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</li>
                            </ul>
                        </div>
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className="text-lg font-medium mb-2 text-white">Movies Involved In</h5>
                            <ul className="list-disc list-inside text-[#757070] text-base font-thin">
                                <li>Movie Title 1</li>
                                <li>Movie Title 2</li>
                                <li>Movie Title 3</li>
                            </ul>
                        </div>
                    </div>
                    <div className='bg-[#262626] rounded-md px-4 py-4'>
                        <div className="mb-6">
                            <h5 className="text-white">Full Name</h5>
                            <p className="text-[#757070] text-base font-thin">John Doe</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Date of Birth</h5>
                            <p className="text-[#757070] text-base font-thin">January 1, 1970</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Birthplace</h5>
                            <p className="text-[#757070] text-base font-thin">City, Country</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Nationality</h5>
                            <p className="text-[#757070] text-base font-thin">Nationality</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Parents</h5>
                            <p className="text-[#757070] text-base font-thin">Parent Name 1, Parent Name 2</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Children</h5>
                            <p className="text-[#757070] text-base font-thin">Child Name 1, Child Name 2</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Spouses</h5>
                            <p className="text-[#757070] text-base font-thin">Spouse Name</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Siblings</h5>
                            <p className="text-[#757070] text-base font-thin">Sibling Name 1, Sibling Name 2</p>
                        </div>
                        <div className="mb-6">
                            <h5 className="text-white">Height</h5>
                            <p className="text-[#757070] text-base font-thin">Height in cm</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActorScreenUser;