import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../components/HeaderAdmin';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Image } from "lucide-react";
import Modal from 'react-modal';
import supabase from "../config/supabaseClient";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';

Modal.setAppElement('#root'); // Asegúrate de que el root ID es correcto

async function uploadImage(file) {
    console.log("The image is uploading to the DB...");
    if (file == null) {
        return null;
    }
    const { data, error } = await supabase
        .storage
        .from("images")
        .upload('movies/' + uuidv4(), file);
    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }
    console.log("Retrieving information from the photo...");
    const path = data.path;
    const { data: ImportantData } = await supabase
        .storage
        .from('images')
        .getPublicUrl(path);

    return { url: ImportantData.publicUrl, path: path };
}

async function deleteImage(path) {
    const { error } = await supabase
        .storage
        .from('images')
        .remove([path]);
    if (error) {
        console.error('Error deleting image:', error);
    }
}

const Movie = () => {
    const [releaseDate, setReleaseDate] = useState(null);
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [genres, setGenres] = useState([]);
    const [availableGenres, setAvailableGenres] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [castModalIsOpen, setCastModalIsOpen] = useState(false);
    const [directorModalIsOpen, setDirectorModalIsOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [newGenre, setNewGenre] = useState('');
    const [imagePath, setImagePath] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [actors, setActors] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [selectedActor, setSelectedActor] = useState('');
    const [selectedDirector, setSelectedDirector] = useState('');
    const [cast, setCast] = useState([]);
    const [movieDirectors, setMovieDirectors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGenres();
        fetchActors();
        fetchDirectors();
    }, []);

    const fetchActors = async () => {
        const { data, error } = await supabase
            .from('actoranddirector')
            .select('*');
        if (error) console.error('Error fetching actors:', error);
        else setActors(data);
    };

    const fetchDirectors = async () => {
        const { data, error } = await supabase
            .from('actoranddirector')
            .select('*');
        if (error) console.error('Error fetching directors:', error);
        else setDirectors(data);
    };

    const fetchGenres = async () => {
        const { data, error } = await supabase
            .from('category')
            .select('*');
        if (error) console.error('Error fetching genres:', error);
        else setAvailableGenres(data);
    };

    const addGenre = () => {
        if (selectedGenre && !genres.some(genre => genre.id === selectedGenre.id)) {
            setGenres([...genres, selectedGenre]);
        }
        setModalIsOpen(false);
    };
    
    
    
    const deleteGenreFromDB = async (genreId) => {
        const { error } = await supabase
            .from('category')
            .delete()
            .eq('id', genreId);
        if (error) console.error('Error deleting genre:', error);
        else {
            setAvailableGenres(availableGenres.filter((genre) => genre.id !== genreId));
        }
    };
    
    
    const addNewGenreToDB = async () => {
        if (newGenre) {
            // Verificar si el género ya existe en la base de datos
            const { data: existingGenre, error: fetchError } = await supabase
                .from('category')
                .select('id')
                .eq('nombre', newGenre)
                .single();
    
            if (fetchError && fetchError.code !== 'PGRST116') { // Ignorar error "no rows found"
                console.error('Error checking existing genre:', fetchError);
                return;
            }
    
            if (existingGenre) {
                alert('Genre already exists:', existingGenre);
                setNewGenre('');
                return;
            }
    
            // Insertar el nuevo género si no existe
            const { data, error } = await supabase
                .from('category')
                .insert([{ nombre: newGenre }]);
    
            if (error) {
                console.error('Error adding genre:', error);
            } else {
                // Verifica si data está definido y es un array
                fetchGenres();
                console.log(availableGenres);
                setNewGenre('');
            }
        }
    };

    const addCast = () => {
        if (selectedActor && !cast.some(actor => actor.id === selectedActor.id)) {
            setCast([...cast, selectedActor]);
        }
        setCastModalIsOpen(false);
    };
    

    const addDirector = () => {
        if (selectedDirector && !movieDirectors.some(director => director.id === selectedDirector.id)) {
            setMovieDirectors([...movieDirectors, selectedDirector]);
        }
        setDirectorModalIsOpen(false);
    };
    

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const { url, path } = await uploadImage(file);
            if (url) {
                setImageUrl(url);
                setImagePath(path);
            }
        }
        alert("Image uploaded successfully");
    };

    const handleDeleteImage = async () => {
        if (imagePath) {
            await deleteImage(imagePath);
            setImageUrl('');
            setImagePath(null);
        }
        alert("Image deleted successfully");
    };

    const navigateToAddActorDirector = () => {
        navigate('/AddActorDirector');
    };

    const directorOptions = directors.map(director => ({
        value: director.id,
        label: director.name
    }));

    const actorOptions = actors.map(actor => ({
        value: actor.id,
        label: actor.name
    }));

    const handleAddMovie = async () => {
        // Inserta en la tabla 'movie'
        const { data: movieData, error: movieError } = await supabase
            .from('movie')
            .insert([
                {
                    title: document.getElementById('title').value,
                    releaseDate: releaseDate,
                    duration: duration,
                    price: price,
                    sinopsis: document.getElementById('sinopsis').value,
                    photo: imageUrl
                }
            ])
            .select();
    
        if (movieError) {
            console.error('Error adding movie:', movieError);
            return;
        }
    
        const movieId = movieData[0].id;
    
        // Inserta en la tabla 'moviexactor'
        for (const actor of cast) {
            const { error: actorError } = await supabase
                .from('movieXactor')
                .insert([
                    {
                        idMovie: movieId,
                        idActor: actor.id
                    }
                ]);
    
            if (actorError) {
                console.error('Error adding moviexactor:', actorError);
                return;
            }
        }
    
        // Inserta en la tabla 'moviexcategory'
        for (const genre of genres) {
            const { error: genreError } = await supabase
                .from('movieXcategory')
                .insert([
                    {
                        idMovie: movieId,
                        idCategory: genre.id
                    }
                ]);
    
            if (genreError) {
                console.error('Error adding moviexcategory:', genreError);
                return;
            }
        }
    
        // Inserta en la tabla 'moviexdirector'
        console.log(movieDirectors)
        for (const director of movieDirectors) {
            const { error: directorError } = await supabase
                .from('movieXdirector')
                .insert([
                    {
                        idMovie: movieId,
                        idDirector: director.id
                    }
                ]);
    
            if (directorError) {
                console.error('Error adding moviexdirector:', directorError);
                return;
            }
        }
    
        alert('Movie added successfully!');
    };
    
    

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            <Header />
            <div className="flex justify-center w-full mt-8">
                <div className="relative" style={{ 
                        width: '1594px', 
                        height: '835px', 
                        backgroundImage: `url('${imageUrl}')`, 
                        backgroundSize: 'contain', 
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end items-center pb-16">
                        <Input type="text" id="title" placeholder="Title" className="bg-inherit text-[38px] text-center text-white border-0 font-bold h-[57px] w-[1194px]"/>
                        <Textarea placeholder="Sinopsis" id="sinopsis" className="bg-inherit text-[18px] text-center text-white border-0 font-bold h-[27px] w-[1194px]"  />
                        <div className="mt-4 flex space-x-2">
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="fileInput"
                                onChange={handleFileChange}
                            />
                            <Button variant="outline" className="bg-[#E50000] border-1 h-[56px] w-[56px]" size="icon" onClick={() => document.getElementById('fileInput').click()}>
                                <Image className="h-28px w-28px" />
                            </Button>
                            <Button variant="outline" className='w-[56px] h-[56px] bg-black border-1' size="icon" onClick={handleDeleteImage}>
                                <Trash2 className="h-28px w-28px" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[1596px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pt-[114px]">
                {/* Div Izquierdo Superior */}
                <div className="bg-[#1A1A1A] p-6 rounded-lg lg:col-span-2 ">
                    <h3 className="text-lg font-semibold">Description</h3>
                    <Textarea  
                        className="w-full bg-gray-700 bg-inherit p-4 rounded-lg mt-2" 
                    />
                </div>

                {/* Div Izquierdo Inferior */}
                <div className="bg-[#1A1A1A] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Cast</h3>
                    <div className="flex flex-col gap-2 mt-2">
                        {cast.map((member, index) => (
                            <Button onClick={() => setCast(cast.filter((g) => g.id !== member.id))} key={index} className="bg-[#141414] p-2 rounded">{member.name}</Button>
                        ))}
                        <Button variant="outline" className="bg-[#141414] p-2 rounded" onClick={() => setCastModalIsOpen(true)}>Add Cast Member</Button>
                    </div>

                </div>

                {/* Div Derecho */}
                <div className="bg-[#1A1A1A] p-6 rounded-lg">
                <h3 className="text-lg font-semibold">Released Year</h3>
                    <DatePicker
                        selected={releaseDate}
                        onChange={(date) => setReleaseDate(date)}
                        dateFormat="yyyy"
                        showYearPicker
                        placeholderText="Select year"
                        className="w-full bg-[#141414] p-4 w-[75px] h-[40px] rounded-lg mt-2"
                    />
                    <h3 className="text-lg font-semibold mt-6">Price</h3>
                    <Input 
                        type="number" 
                        placeholder="Insert price ($)" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-[#141414] p-4 w-[300px] h-[40px] rounded-lg mt-2" 
                    />
                    <h3 className="text-lg font-semibold mt-6">Duration</h3>
                    <Input 
                        type="number" 
                        placeholder="Insert duration (minutes)" 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-[#141414] p-4 w-[300px] h-[40px] rounded-lg mt-2" 
                    />
                    <h3 className="text-lg font-semibold mt-6">Genres</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {genres.map((genre, index) => (
                            <Button onClick={() => setGenres(genres.filter((g) => g.id !== genre.id))} key={index} className="bg-[#141414] p-2 rounded">{genre.nombre}</Button>
                        ))}
                        <Button variant="outline" className="bg-[#141414] p-2 rounded" onClick={() => setModalIsOpen(true)}>Add Genre</Button>
                    </div>


                    <h3 className="text-lg font-semibold mt-6">Directors</h3>
                    <div className="flex flex-col gap-2 mt-2">
                        {movieDirectors.map((director, index) => (
                            <Button onClick={() => setMovieDirectors(movieDirectors.filter((g) => g.id !== director.id))} key={index} className="bg-[#141414] p-2 rounded">{director.name}</Button>
                        ))}
                        <Button variant="outline" className="bg-[#141414] p-2 rounded" onClick={() => setDirectorModalIsOpen(true)}>Add Director</Button>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Button className="bg-red-600 p-4 rounded-lg" onClick={handleAddMovie}>Add Movie</Button>
                    </div>
                </div>
            </div>

            {/* Modal para seleccionar y añadir géneros */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Add Genre"
                className="bg-[#1A1A1A] p-6 rounded-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
            >
                <h2 className="text-lg text-white font-semibold mb-4">Manage Genres</h2>
                <select
                    value={selectedGenre ? selectedGenre.nombre : ''}
                    onChange={(e) => {
                        const selected = availableGenres.find(genre => genre.nombre === e.target.value);
                        setSelectedGenre(selected);
                    }}
                    className="w-full bg-[#141414] text-white p-4 rounded-lg mt-2"
                >
                    <option value="" className='text-white' disabled>Select a genre</option>
                    {availableGenres.map((genre) => (
                        <option className='text-white' key={genre.id} value={genre.nombre}>{genre.nombre}</option>
                    ))}
                </select>
                <div className="mt-2 flex justify-end space-x-2">
                    <Button className="bg-[#E50000] p-2 rounded-lg" onClick={addGenre}>Add Selected Genre</Button>
                    <Button className="bg-[#E50000] p-2 rounded-lg" onClick={() => deleteGenreFromDB(selectedGenre.id)}>Delete Selected Genre</Button>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg text-white font-semibold">Add New Genre</h3>
                    <Input 
                        type="text" 
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        className="w-full bg-[#141414] text-white p-2 rounded-lg mt-2"
                    />
                    <div className="mt-2 flex justify-end">
                        <Button className="bg-[#E50000] p-2 rounded-lg" onClick={addNewGenreToDB}>Add New Genre</Button>
                    </div>
                </div>
            </Modal>



            
            {/* Modal para seleccionar y añadir actores al cast */}
            <Modal
                isOpen={castModalIsOpen}
                onRequestClose={() => setCastModalIsOpen(false)}
                contentLabel="Select Cast"
                className="bg-[#1A1A1A] p-6 rounded-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
            >
                <h2 className="text-lg text-white font-semibold mb-4">Select Cast Member</h2>
                <Select
                    options={actorOptions}
                    onChange={(selectedOption) => setSelectedActor({ id: selectedOption.value, name: selectedOption.label })}
                    className="w-full text-white p-4 rounded-lg mt-2"
                    placeholder="Select a director"
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: '#141414',
                            borderColor: '#141414',
                            color: 'white'
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: '#1A1A1A',
                            color: 'white'
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: 'white'
                        }),
                        input: (base) => ({
                            ...base,
                            color: 'white'
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: 'white'
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected ? '#333' : state.isFocused ? '#444' : '#1A1A1A',
                            color: 'white'
                        }),
                        dropdownIndicator: (base) => ({
                            ...base,
                            color: 'white'
                        }),
                        indicatorSeparator: (base) => ({
                            ...base,
                            backgroundColor: 'white'
                        })
                    }}
                />
                <div className="mt-4 flex justify-end space-x-4">
                    <Button className="bg-[#E50000] p-2 rounded-lg" onClick={addCast}>Add Cast Member</Button>
                    <Button className="bg-[#E50000] p-2 rounded-lg" onClick={navigateToAddActorDirector}>Add New Actor</Button>
                </div>
            </Modal>

            {/* Modal para seleccionar y añadir directores */}
            <Modal
                isOpen={directorModalIsOpen}
                onRequestClose={() => setDirectorModalIsOpen(false)}
                contentLabel="Select Director"
                className="bg-[#1A1A1A] p-6 rounded-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
            >
                <h2 className="text-lg text-white font-semibold mb-4">Select Director</h2>
                <Select
                    options={directorOptions}
                    onChange={(selectedOption) => setSelectedDirector({ id: selectedOption.value, name: selectedOption.label })}
                    className="w-full text-white p-4 rounded-lg mt-2"
                    placeholder="Select a director"
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: '#141414',
                            borderColor: '#141414',
                            color: 'white'
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: '#1A1A1A',
                            color: 'white'
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: 'white'
                        }),
                        input: (base) => ({
                            ...base,
                            color: 'white'
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: 'white'
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected ? '#333' : state.isFocused ? '#444' : '#1A1A1A',
                            color: 'white'
                        }),
                        dropdownIndicator: (base) => ({
                            ...base,
                            color: 'white'
                        }),
                        indicatorSeparator: (base) => ({
                            ...base,
                            backgroundColor: 'white'
                        })
                    }}
                />
                <div className="mt-4 flex justify-end space-x-4">
                    <Button className="bg-[#E50000] p-2 rounded-lg" onClick={addDirector}>Add Director</Button>
                    <Button className="bg-[#E50000] p-2 rounded-lg" onClick={navigateToAddActorDirector}>Add New Director</Button>
                </div>
            </Modal>

        </div>
    );
};

export default Movie;
