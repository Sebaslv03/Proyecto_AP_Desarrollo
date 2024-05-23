import React from 'react';
import { useState } from 'react';
import Header from '../components/Header';
import ModalReview from '../components/ModalReview';
import CommentCarousel from '../components/CommentCarousel';
import * as Accordion from '@radix-ui/react-accordion';
const Show = () => {
    const comments = [
        { author: 'Usuario 1', text: '¡Gran página web!' },
        { author: 'Usuario 2', text: 'Me encanta este sitio.' },
        { author: 'Usuario 3', text: 'Los productos son geniales.' },
        // Puedes agregar más comentarios aquí
      ];
      //generate season model data
    const seasons = [
        {
            number: 1,
            episodes: [
                { title: 'Episode 1',
                  description: 'Loen ipmsum dolor',
                  image:"https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
                { title: 'Episode 2',
                  description: 'Loen ipmsum dolor',
                  image:"https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
                { title: 'Episode 3',
                  description: 'Loen ipmsum dolor',
                  image:"https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
            ],
        },
        {
            number: 2,
            episodes: [
                { title: 'Episode 1',
                  description: 'Loen ipmsum dolor',
                  image:"https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
                { title: 'Episode 2',
                  description: 'Loen ipmsum dolor',
                  image:"https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
                { title: 'Episode 3',
                  description: 'Loen ipmsum dolor',
                  image:"https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
            ],
        },
    ];


    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <Header />
            <div className="container mx-auto py-4 px-4 ">
                <div className='flex flex-col items-center my-3'>
                    <img src="https://m.media-amazon.com/images/M/MV5BYTljM2Y0NTctZDE5OC00ZGU5LWJiZWYtMTkxMGY2ODNlNjdmXkEyXkFqcGdeQXVyMTAwMjgyOTY4._V1_FMjpg_UX2160_.jpg" alt="Add Photo" className="h-209 w-130 mx-auto " />
                    <p className='text-2xl font-bold my-3'>Tulsa King</p>
                    <div className='justify-center'>
                        <button className="bg-[#333] text-white p-2 rounded-md mx-3 my-3 w-40" onClick={()=>alert("Add Sucess")}>Wish</button>
                        <button className="bg-[#333] text-white p-2 rounded-md mx-3 my-3 w-40" onClick={()=>alert("Add Sucess")}>Cart</button>
                    </div>
                </div>
                {/* Add your movie content here */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 items-start">
                    <div className="grid grid-cols-1 col-span-1 md:col-span-2 gap-6 items-center">
                        {seasons.map((season, index) => (
                            <Accordion.Root key={index} collapsible type='single' defaultValue='item-1' className='bg-[#333] text-white py-2 px-2 rounded-md mx-3 my-3 w-auto flex flex-col'>
                                    <Accordion.Item className="AccordionItem" value={`item-${index}`}>
                                        <Accordion.Trigger>Season {season.number}</Accordion.Trigger>
                                        <Accordion.Content>
                                            {season.episodes.map((episode, episodeIndex) => (
                                                <div key={episodeIndex} className="w-full rounded my-2 mx-2 bg-[#222] border border-[#333] text-white text-center justify-center items-center">
                                                    <img src={episode.image} alt="Add Photo" className="h-209 w-130 mx-auto " />
                                                    <h1>{episode.title}</h1>
                                                    <p className='text-[#757070]'>
                                                        {episode.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </Accordion.Content>
                                    </Accordion.Item>
                                </Accordion.Root>
                        ))}
                        
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className="">Description</h5>
                            <p className="text-[#757070]">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>       
                        </div>
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className=" text-white">Cast</h5>
                            {/*Mapping Cast*/}
                            <input type="text" id="first-last-name" value={"B. Ajaneesh Loknath"} className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text" id="first-last-name" value={"B. Ajaneesh Loknath"} className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text" id="first-last-name" value={"B. Ajaneesh Loknath"} className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                        </div>
                        <div className='bg-[#262626] rounded-md px-4 py-4 flex-col flex items-center justify-center'>
                            <div className='flex justify-center items-center'>
                                <h5 className=" text-white w-96">Reviews</h5>
                                {/*<button className='bg-[#333] text-white p-2 rounded-md mx-3 my-3' onClick={openModalReview}>Add Review</button>*/}
                                <ModalReview />
                            </div>
                            {/* Aqui va el review que es un carouselll */}
                            <input type="text" id="name"  value={"AQUI VA EL CAROUSELL"} className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" disabled/>
                            <h1>Comentarios</h1>
                            <CommentCarousel comments={comments} />

                        </div>
                    </div>
                    <div className='bg-[#262626] rounded-md px-4 py-4'>
                        <label className="block mb-2">Release Year</label>
                        <p className="text-[#757070] mb-2">2021</p>
                        <label className="block mb-2">Available Languages</label>
                        <div className='justify-center items-center inline-block mb-10 '>
                            {/**Mapping languajes */}
                            <input type="text"  value={"English"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text"  value={"Spanish"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text"  value={"French"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text"  value={"English"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text"  value={"Spanish"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text"  value={"French"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                        </div>
                        
                        <label  className="block mb-2">Ratings</label>
                        <input type="text" id="second-last-name" placeholder="Enter Second Last Name" className="w-auto p-2 rounded bg-[#222] border border-[#333] text-white mb-5" />

                        <label className="block mb-2"><h1>Genres</h1></label>
                        <div className='justify-center items-center inline-block mb-10 '>
                            {/**Mapping genres */}
                            <input type="text"  value={"Drama"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text"  value={"Action"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text"  value={"Gang"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text"  value={"Adult"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text"  value={"Mature"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            <input type="text"  value={"Stallone"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            
                        </div>

                        <label  className="block mb-2">Directors</label>
                        {/**Mapping directors */}
                        <input type="text" id="second-last-name" placeholder="Juan Santamaría" className="w-auto p-2 my-2 mx-2 rounded bg-[#222] border border-[#333] text-white mb-5" disabled/>
                        <input type="text" id="second-last-name" placeholder="Jose María " className="w-auto p-2 my-2 mx-2 rounded bg-[#222] border border-[#333] text-white mb-5" disabled/>

                        <label  className="block mb-2">Writters</label>
                        {/**Mapping Writters */}
                        <input type="text" id="second-last-name" placeholder="Juan Santamaría" className="w-auto p-2 my-2 mx-2 rounded bg-[#222] border border-[#333] text-white mb-5" disabled/>
                        <input type="text" id="second-last-name" placeholder="Jose María " className="w-auto p-2 my-2 mx-2 rounded bg-[#222] border border-[#333] text-white mb-5" disabled/>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Show;