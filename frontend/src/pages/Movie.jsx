import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/HeaderUser';
import ModalReview from '../components/ModalReview';
import CommentCarousel from '../components/CommentCarousel';
import supabase from '../config/supabaseClient';

const Movie = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [movie, setMovie] = useState({}); // [1
    const [cast, setCast] = useState([]); // [2]
    const [directors, setDirectors] = useState([]); // [3]
    const [platforms, setPlatforms] = useState([]); // [4]
    const [categories, setCategories] = useState([]); // [5]
    const releaseDate = movie.releaseDate;
    const year = new Date(releaseDate).getUTCFullYear();
    const [avgRating, setAvgRating] = useState(0);
    useEffect(() => {
        //testting the connection
        const fetchMovies = async () => {
            const { data, error } = await supabase
                .from('movie')
                .select('*')
                .eq('id', id);
            if (error) {
                console.log(error);

            }
            if (data) {
                setMovie(data[0]);
                console.log(data[0]);
            }
        }
        fetchMovies();
        const fetchActors = async () => {
            const { data, error } = await supabase
                .rpc('getactorsbymovieid', { pelicula_id: id })
            if (error) {
                console.error(error)
            }
            if (data) {
                setCast(data);
                
            }
        }
        fetchActors();
        const fetchDirectors = async () => {
            const { data, error } = await supabase
                .rpc('getdirectorsbymovieid', { movie_id: id })
            if (error) {
                console.error(error)
            }
            if (data) {
                setDirectors(data);
            }
        }
        fetchDirectors();
        const fetchPlatforms = async () => {
            const { data, error } = await supabase
                .rpc('getplatformsbymovieid', { movie_id: id })
            if (error) {
                console.error(error)
            }
            if (data) {
                setPlatforms(data);
            }
        }
        fetchPlatforms();
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .rpc('getcategoriesbymovieid', { movie_id: id })
            if (error) {
                console.error(error)
            }
            if (data) {
                setCategories(data);
            }
        }
        fetchCategories();
        const fetchAvgMovieRating = async () => {
            const { data, error } = await supabase
                .rpc('getavgmoviebyid', { movie_id: id })
            if (error) {
                console.error(error)
            }
            if (data) {                
                setAvgRating(data[0].average_rating);
            }
        }
        fetchAvgMovieRating();
    }, [id]);
    const handlePersonClick = (personId, category) => {
        navigate(`/ActorScreenUser/${personId}/${category}`);
    };

    const handleWishCart = async () => {
        const {data: { user },} = await supabase.auth.getUser()
        const { dataUser, errorUser: fetchError } = await supabase
            .from('person')
            .select('*')
            .eq('email', user.email);
        if(errorUser){
            console.log(errorUser)
        } else if(dataUser){
            console.log(dataUser)
        }
    }

    const handleCart = async () => {
        const {data: { user },} = await supabase.auth.getUser()
        const { dataUser, errorUser: fetchError } = await supabase
            .from('person')
            .select('*')
            .eq('email', user.email);
        if(errorUser){
            console.log(errorUser)
        } else if(dataUser){
            console.log(dataUser)
        }
    }


    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <Header />
            <div className="container mx-auto py-4 px-4 ">
                <div className='flex flex-col items-center my-3'>
                    <img src={movie.photo} alt="Add Photo" className="h-209 w-130 mx-auto " />
                    <p className='text-2xl font-bold my-3'>{movie.title}</p>
                    <div className='justify-center'>
                        <button className="bg-[#333] text-white p-2 rounded-md mx-3 my-3 w-40" onClick={() => handleWishCart}>Wish</button>
                        <button className="bg-[#333] text-white p-2 rounded-md mx-3 my-3 w-40" onClick={() => handleCart}>Cart</button>
                    </div>
                </div>
                {/* Add your movie content here */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 items-start">
                    <div className="grid grid-cols-1 col-span-1 md:col-span-2 gap-6 items-center">
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className="">Description</h5>
                            <p className="text-[#757070]">{movie.sinopsis}</p>
                        </div>
                        <div className='bg-[#262626] rounded-md px-4 py-4'>
                            <h5 className=" text-white">Cast</h5>
                            {/**Mapping actors */
                                cast.map((actor) => (
                                    <button key={actor.name} onClick={() => handlePersonClick(actor.id_actor, "actor")} type="button"
                                    id="first-last-name" 
                                    className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white"
                                    > {actor.name + " " + actor.lastname}</button>
                                ))}
                        </div>
                        <div className='bg-[#262626] rounded-md px-4 py-4 flex-col flex items-center justify-center'>
                            <div className='flex justify-center items-center'>
                                <h5 className=" text-white w-96">Reviews</h5>
                                {/*<button className='bg-[#333] text-white p-2 rounded-md mx-3 my-3' onClick={openModalReview}>Add Review</button>*/}
                                <ModalReview id={id}/>
                            </div>
                            {/* Aqui va el review que es un carousell */}
                            <h1>Comentarios</h1>
                            <CommentCarousel id={id} />

                        </div>
                    </div>
                    <div className='bg-[#262626] rounded-md px-4 py-4'>
                        <label className="block mb-2">Release Year</label>
                        <p className="text-[#757070] mb-2">{year}</p>
                        <label className="block mb-2">Available Platforms</label>
                        <div className='justify-center items-center inline-block mb-10 '>
                            {/**Mapping plataform*/}

                            {platforms.length > 0 ? (
                                platforms.map((platform) => (
                                    <input key={platform.name} type="text" id="first-last-name" value={platform.name} className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                                ))
                            ) : (
                                <input type="text" value={"Unknown"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            )}
                        </div>

                        <label className="block mb-2">Ratings</label>
                        <input type="text" id="second-last-name" value={avgRating} className="w-auto p-2 rounded bg-[#222] border border-[#333] text-white mb-5" disabled />

                        <label className="block mb-2"><h1>Genres</h1></label>
                        <div className='justify-center items-center inline-block mb-10 '>
                            {/**Mapping genres */}
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <input key={category.name} type="text" id="first-last-name" value={category.name} className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                                ))
                            ) : (
                                <input type="text" value={"Unknown"} className=" w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white" disabled />
                            )}
                        </div>

                        <label className="block mb-2">Directors</label>
                        {/**Mapping directors */}
                        {directors.map((director) => (
                            <button key={director.name} onClick={() => handlePersonClick(director.director_id, "director")} type="button"
                            id="first-last-name" 
                            className="w-auto p-2 rounded my-2 mx-2 bg-[#222] border border-[#333] text-white"
                            > {director.name + " " + director.lastname}</button>
                        ))}


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Movie;