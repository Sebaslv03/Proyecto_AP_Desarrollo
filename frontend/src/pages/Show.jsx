import React from 'react';
import { useState, useEffect } from 'react';
import Header from '../components/HeaderUser';
import ModalReview from '../components/ModalReviewShow';
import CommentCarousel from '../components/CommentCarouselShow';
import * as Accordion from '@radix-ui/react-accordion';
import { useParams,useNavigate} from 'react-router-dom';
import supabase from '../config/supabaseClient';
const Show = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [show, setShow] = useState({}); // [1
    const [cast, setCast] = useState([]); // [2
    const [platforms, setPlatforms] = useState([]); // [3]
    const [categories, setCategories] = useState([]); // [4]
    const [directors, setDirectors] = useState([]); // [5
    const [seasons, setSeasons] = useState([]);
    const [prueba, setPrueba] = useState([]);
    const releaseDate = show.releasedate;
    const year = new Date(releaseDate).getUTCFullYear();
    const [rating, setRating] = useState(0); // [7]
    useEffect(() => {
        //testting the connection
        const fetchData = async (functionName, setState, value) => {
            console.log(value);
            const { data, error } = await supabase
                .rpc(functionName, { show_id: value });
            if (error) {
                console.log(error);
            }
            if (data) {
                if (functionName === 'getshowbyid') {
                    setState(data[0]);
                    console.log(data[0]);
                } else {
                    setState(data);
                    console.log(data);
                }

            }
        }
        fetchData('getshowbyid', setShow, id);
        fetchData('getactorsbyshowid', setCast, id)
        fetchData('getplatformsbyshowid', setPlatforms, id)
        fetchData('getcategoriesbyshowid', setCategories, id)
        fetchData('getdirectorsbyshowid', setDirectors, id)
        //fetchData('getavgshowbyid', setRating, id)
        fetchShowSeasons();
        fetchAndLogSeasons();
    }, [id]);

    const handleFetchSeasons = async () => {
        const seasons1 = await fetchShowSeasons();
        console.log('Fetched seasons:', seasons1);
        setSeasons(seasons1);
        return seasons1;
    };
    
    // Llamada a la función y manejo del valor retornado
    const fetchAndLogSeasons = async () => {
        const a = await handleFetchSeasons();
        setSeasons(a)
    };
    

    const fetchShowSeasons = async () => {
        const { data, error } = await supabase
            .from('season')
            .select('id, numberOfSeason')
            .eq('idShow', id);
    
        if (error) {
            console.error('Error fetching seasons:', error);
            return null;
        }
    
        const seasonDetails = await Promise.all(data.map(async (season) => {
            const { data: episodes, error: episodeError } = await supabase
                .from('episode')
                .select('*')
                .eq('idSeason', season.id);
    
            if (episodeError) {
                console.error('Error fetching episodes:', episodeError);
                return { ...season, episodes: [] }; // Devuelve una temporada sin episodios en caso de error
            }
    
            return { ...season, episodes };
        }));
    
        setSeasons(seasonDetails); 
        setPrueba(seasonDetails);
    
        return seasonDetails;
    };
    

    const comments = [
        { author: 'Usuario 1', text: '¡Gran página web!' },
        { author: 'Usuario 2', text: 'Me encanta este sitio.' },
        { author: 'Usuario 3', text: 'Los productos son geniales.' },
        // Puedes agregar más comentarios aquí
    ];
    //generate season model data
    const seasonsa = [
        {
            number: 1,
            episodes: [
                {
                    title: 'Episode 1',
                    description: 'Loen ipmsum dolor',
                    image: "https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
                {
                    title: 'Episode 2',
                    description: 'Loen ipmsum dolor',
                    image: "https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
                {
                    title: 'Episode 3',
                    description: 'Loen ipmsum dolor',
                    image: "https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
            ],
        },
        {
            number: 2,
            episodes: [
                {
                    title: 'Episode 1',
                    description: 'Loen ipmsum dolor',
                    image: "https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
                {
                    title: 'Episode 2',
                    description: 'Loen ipmsum dolor',
                    image: "https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
                {
                    title: 'Episode 3',
                    description: 'Loen ipmsum dolor',
                    image: "https://m.media-amazon.com/images/M/MV5BY2VmMzgzYzctZDkzMy00YjgxLWI0MjItOGRjNTdmYTYwZWQxXkEyXkFqcGdeQXVyMTM0NTczMzE3._V1_QL75_UY281_CR16,0,500,281_.jpg"
                },
            ],
        },
    ];
    const handlePersonClick = (personId, category) => {
        navigate(`/ActorScreenUser/${personId}/${category}`);
    };


    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <Header />
            <div className="container mx-auto py-4 px-4 ">
                <div className='flex flex-col items-center my-3'>
                    <img src={show.photo} alt="Add Photo" className="h-209 w-130 mx-auto " />
                    <p className='text-2xl font-bold my-3'>{show.name}</p>
                    <div className='justify-center'>
                        <button className="bg-[#333] text-white p-2 rounded-md mx-3 my-3 w-40" onClick={() => alert("Add Sucess")}>Wish</button>
                        <button className="bg-[#333] text-white p-2 rounded-md mx-3 my-3 w-40" onClick={() => alert("Add Sucess")}>Cart</button>
                    </div>
                </div>
                {/* Add your movie content here */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 items-start">
                    <div className="grid grid-cols-1 col-span-1 md:col-span-2 gap-6 items-center">
                    {seasons.map((season) => (
                    <div key={season.id} className="mt-4">
                        <div className="flex justify-between items-center bg-[#333] p-2 rounded">
                            <h4 className="text-md font-semibold">Season {season.numberOfSeason}</h4>
                        </div>
                        {season.episodes.map((episode) => (
                            <div key={episode.id} className="mt-2 p-2 rounded bg-inherit">
                                <div className="flex flex-col">
                                    <input
                                        type="text"
                                        placeholder="Episode Title"
                                        className="bg-[#333] p-2 rounded mt-2"
                                        value={"Title: " + episode.name}
                                        disabled
                                    />
                                    <textarea
                                        placeholder="Episode Synopsis"
                                        className="bg-[#333] p-2 rounded mt-2"
                                        value={"Sinopsis: " + episode.sinopsis}
                                        disabled
                                    />
                                    <input
                                        type="text"
                                        placeholder="Duration (minutes)"
                                        className="bg-[#333] p-2 rounded mt-2"
                                        value={"Duration: " + episode.duration.toString() + " min"}
                                        disabled
                                    />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className="">Description</h5>
                            <p className="text-[#757070]">{show.sinopsis}</p>
                        </div>
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className=" text-white">Cast</h5>
                            {/*Mapping actors*/
                                cast.map((actor) => (
                                    <button key={actor.name} type="button"
                                        id="first-last-name"
                                        className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white"
                                        onClick={() => handlePersonClick(actor.id_actor, "actor")}
                                    >
                                        {actor.name +" "+actor.lastname}
                                    </button>
                                ))}                          
                        </div>
                        <div className='bg-[#262626] rounded-md px-4 py-4 flex-col flex items-center justify-center'>
                            <div className='flex justify-center items-center'>
                                <h5 className=" text-white w-96">Reviews</h5>
                                {/*<button className='bg-[#333] text-white p-2 rounded-md mx-3 my-3' onClick={openModalReview}>Add Review</button>*/}
                                <ModalReview id={id}/>
                            </div>
                            {/* Aqui va el review que es un carouselll */}
                            
                            <h1>Comentarios</h1>
                             <CommentCarousel id={id} />

                        </div>
                    </div>
                    <div className='bg-[#262626] rounded-md px-4 py-4'>
                        <label className="block mb-2">Release Year</label>
                        <p className="text-[#757070] mb-2">{year}</p>
                        <label className="block mb-2">Available Platforms</label>
                        <div className='justify-center items-center inline-block mb-10 '>
                            {/**Mapping platforms */
                            platforms.length > 0 ? (
                                platforms.map((platform) => (
                                    <input key={platform.name} type="text" id="first-last-name" value={platform.name} className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                                ))
                            ) : (
                                <input type="text" value={"Unknown"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            )}                                                    
                        </div>

                        <label className="block mb-2">Ratings</label>
                        <input type="text" id="second-last-name" /*value={rating[0].average_rating}*/ className="w-auto p-2 rounded bg-[#222] border border-[#333] text-white mb-5" disabled/>

                        <label className="block mb-2"><h1>Genres</h1></label>
                        <div className='justify-center items-center inline-block mb-10 '>
                            {/**Mapping genres */
                            categories.length > 0 ? (
                                categories.map((category) => (
                                    <input key={category.name} type="text" id="first-last-name" value={category.name} className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                                ))
                            ) : (
                                <input type="text" value={"Unknown"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            )}
                        </div>

                        <label className="block mb-2">Directors</label>
                        {/**Mapping directors */
                        directors.map((director) => (
                            <button key={director.name} id="first-last-name"  className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white"
                            onClick={() => handlePersonClick(director.director_id, "director")}
                            >{director.name + " " + director.lastname}</button> 
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Show;