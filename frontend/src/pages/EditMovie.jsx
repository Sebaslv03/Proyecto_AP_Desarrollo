import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

async function deleteImage(publicUrl) {
    // Extrae el path desde el publicUrl
    // Suponemos que el URL sigue un formato estándar de Supabase:
    // "https://xyz.supabase.co/storage/v1/object/public/your-bucket-name/path/to/file.jpg"
    const basePath = "https://etvvfulbajnrvkzsnkfv.supabase.co/storage/v1/object/public/images/movies/";
    const path = publicUrl.replace(basePath, ''); // Asegúrate de ajustar la base URL a tu configuración de Supabase
    console.log(path)
    const { error } = await supabase
        .storage
        .from('images')
        .remove([path]);

    if (error) {
        console.error('Error deleting image by URL:', error);
    }
}

const EditMovie = () => {
    const { id } = useParams();
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
    const [title, setTitle] = useState('');
    const [sinopsis, setSinopsis] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovieDetails();
        fetchGenres();
        fetchActors();
        fetchDirectors();
    }, []);

    const fetchMovieDetails = async () => {
        const { data, error } = await supabase
            .from('movie')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching movie details:', error);
            return;
        }
        const movie = data;
        console.log(movie)
        setTitle(movie.title);
        setReleaseDate(new Date(movie.releaseDate));
        setDuration(movie.duration);
        setPrice(movie.price);
        setSinopsis(movie.sinopsis);
        setImageUrl(movie.photo);
        // You may need to fetch genres, cast, and directors related to this movie
        fetchMovieGenres();
        fetchMovieCast();
        fetchMovieDirectors();
    };

    const fetchMovieGenres = async () => {
        const { data, error } = await supabase
            .from('movieXcategory')
            .select('idCategory')
            .eq('idMovie', id);
        if (error) {
            console.error('Error fetching movie genres:', error);
            return;
        }
        // Ahora obtenemos los nombres de los géneros usando los IDs recogidos
        const genreIds = data.map(item => item.idCategory);
        const { data: genresData, error: genresError } = await supabase
            .from('category')
            .select('*')
            .in('id', genreIds);
        if (genresError) {
            console.error('Error fetching genres details:', genresError);
            return;
        }
        // Guardamos los géneros como objetos con id y nombre
        setGenres(genresData.map(g => ({ id: g.id, nombre: g.nombre })));
    };
    
    const fetchMovieCast = async () => {
        const { data, error } = await supabase
            .from('movieXactor')
            .select('idActor')
            .eq('idMovie', id);
        if (error) {
            console.error('Error fetching movie cast:', error);
            return;
        }
        const actorIds = data.map(item => item.idActor);
        const { data: actorsData, error: actorsError } = await supabase
            .from('actor')
            .select('*')
            .in('id', actorIds);
        if (actorsError) {
            console.error('Error fetching actor details:', actorsError);
            return;
        }
        // Guardamos actores como objetos con id y nombre completo
        setCast(actorsData.map(a => ({ id: a.id, name: a.name + ' ' + a.lastName })));
    };
    
    const fetchMovieDirectors = async () => {
        const { data, error } = await supabase
            .from('movieXdirector')
            .select('idDirector')
            .eq('idMovie', id);
        if (error) {
            console.error('Error fetching movie directors:', error);
            return;
        }
        const directorIds = data.map(item => item.idDirector);
        const { data: directorsData, error: directorsError } = await supabase
            .from('director')
            .select('*')
            .in('id', directorIds);
        if (directorsError) {
            console.error('Error fetching director details:', directorsError);
            return;
        }
        // Guardamos directores como objetos con id y nombre completo
        setMovieDirectors(directorsData.map(d => ({ id: d.id, name: d.name + ' ' + d.lastName })));
    };
    

    const fetchActors = async () => {
        const { data, error } = await supabase
            .from('actor')
            .select('*');
        if (error) console.error('Error fetching actors:', error);
        else setActors(data);
    };

    const fetchDirectors = async () => {
        const { data, error } = await supabase
            .from('director')
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
        if (imageUrl) {
            await deleteImage(imageUrl);
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
        label: director.name + " " + director.lastName
    }));
    
const actorOptions = actors.map(actor => ({
    value: actor.id,
    label: actor.name + " " + actor.lastName
}));

const handleUpdateMovie = async () => {
    // Actualiza la tabla 'movie'
    const { error: movieError } = await supabase
        .from('movie')
        .update({
            title: title,
            releaseDate: releaseDate,
            duration: duration,
            price: price,
            sinopsis: sinopsis,
            photo: imageUrl
        })
        .eq('id', id);

    if (movieError) {
        console.error('Error updating movie:', movieError);
        return;
    }

    // Actualiza la tabla 'moviexactor'
    // Elimina actores actuales
    await supabase.from('movieXactor').delete().eq('idMovie', id);
    // Inserta nuevos actores
    for (const actor of cast) {
        const { error: actorError } = await supabase
            .from('movieXactor')
            .insert([
                {
                    idMovie: id,
                    idActor: actor.id
                }
            ]);

        if (actorError) {
            console.error('Error updating moviexactor:', actorError);
            return;
        }
    }

    // Actualiza la tabla 'moviexcategory'
    // Elimina géneros actuales
    await supabase.from('movieXcategory').delete().eq('idMovie', id);
    // Inserta nuevos géneros
    for (const genre of genres) {
        const { error: genreError } = await supabase
            .from('movieXcategory')
            .insert([
                {
                    idMovie: id,
                    idCategory: genre.id
                }
            ]);

        if (genreError) {
            console.error('Error updating moviexcategory:', genreError);
            return;
        }
    }

    // Actualiza la tabla 'moviexdirector'
    // Elimina directores actuales
    await supabase.from('movieXdirector').delete().eq('idMovie', id);
    // Inserta nuevos directores
    for (const director of movieDirectors) {
        const { error: directorError } = await supabase
            .from('movieXdirector')
            .insert([
                {
                    idMovie: id,
                    idDirector: director.id
                }
            ]);

        if (directorError) {
            console.error('Error updating moviexdirector:', directorError);
            return;
        }
    }

    alert('Movie updated successfully!');
    //navigate('/HomePageAdmin'); // Redirigir a la página principal o a la página de la película
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
                    <Input 
                        type="text" 
                        id="title" 
                        placeholder="Title" 
                        className="bg-inherit text-[38px] text-center text-white border-0 font-bold h-[57px] w-[1194px]"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
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
                    value={sinopsis}
                    onChange={(e) => setSinopsis(e.target.value)}
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
                    className="bg-[#141414] p-4 w-[75px] h-[40px] rounded-lg mt-2"
                />
                <h3 className="text-lg font-semibold mt-6">Price</h3>
                <Input 
                    type="number" 
                    placeholder="Insert price ($)" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-[#141414] p-4 w-[300px] h-[40px] rounded-lg mt-2" 
                />
                <h3 className="text-lg font-semibold mt-6">Duration</h3>
                <Input 
                    type="number" 
                    placeholder="Insert duration (minutes)" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-[#141414] p-4 w-[300px] h-[40px] rounded-lg mt-2" 
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
                    <Button className="bg-red-600 p-4 rounded-lg" onClick={handleUpdateMovie}>Update Movie</Button>
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
                placeholder="Select a cast member"
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

export default EditMovie;
