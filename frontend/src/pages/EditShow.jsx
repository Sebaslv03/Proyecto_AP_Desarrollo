import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../components/HeaderAdmin';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Image, Plus } from "lucide-react";
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

const EditShow = () => {
    const { id } = useParams();
    const [showDetails, setShowDetails] = useState({
        name: '',
        releaseDate: null,
        price: '',
        sinopsis: '',
        photo: ''
    });
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
    const [showDirectors, setShowDirectors] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchShowDetails();
        fetchGenres();
        fetchActors();
        fetchDirectors();
    }, []);

    const fetchShowDetails = async () => {
        const { data, error } = await supabase
            .from('show')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching show details:', error);
            return;
        }
        const show = data;
        setShowDetails({
            name: show.name,
            releaseDate: new Date(show.releaseDate),
            price: show.price,
            sinopsis: show.sinopsis,
            photo: show.photo
        });
        setImageUrl(show.photo);
        fetchShowGenres();
        fetchShowCast();
        fetchShowDirectors();
        fetchShowSeasons();
    };

    const fetchShowGenres = async () => {
        const { data, error } = await supabase
            .from('showXcategory')
            .select('idCategory')
            .eq('idShow', id);
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

    const fetchShowCast = async () => {
        const { data, error } = await supabase
            .from('showXactor')
            .select('idActor')
            .eq('idShow', id);
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

    const fetchShowDirectors = async () => {
        const { data, error } = await supabase
            .from('showXdirector')
            .select('idDirector')
            .eq('idShow', id);
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
        setShowDirectors(directorsData.map(d => ({ id: d.id, name: d.name + ' ' + d.lastName })));
    };

    const fetchShowSeasons = async () => {
        const { data, error } = await supabase
            .from('season')
            .select('id, numberOfSeason')
            .eq('idShow', id);
        if (error) {
            console.error('Error fetching seasons:', error);
            return;
        }
        const seasonDetails = await Promise.all(data.map(async season => {
            const { data: episodes, error: episodeError } = await supabase
                .from('episode')
                .select('*')
                .eq('idSeason', season.id);
            if (episodeError) {
                console.error('Error fetching episodes:', episodeError);
                return;
            }
            return { ...season, episodes };
        }));
        setSeasons(seasonDetails);
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
            const { data: existingGenre, error: fetchError } = await supabase
                .from('category')
                .select('id')
                .eq('nombre', newGenre)
                .single();
            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Error checking existing genre:', fetchError);
                return;
            }
            if (existingGenre) {
                alert('Genre already exists:', existingGenre);
                setNewGenre('');
                return;
            }
            const { data, error } = await supabase
                .from('category')
                .insert([{ nombre: newGenre }]);
            if (error) {
                console.error('Error adding genre:', error);
            } else {
                fetchGenres();
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
        if (selectedDirector && !showDirectors.some(director => director.id === selectedDirector.id)) {
            setShowDirectors([...showDirectors, selectedDirector]);
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

    const handleUpdateShow = async () => {
        const { error: showError } = await supabase
            .from('show')
            .update({
                name: showDetails.name,
                releaseDate: showDetails.releaseDate,
                price: showDetails.price,
                sinopsis: showDetails.sinopsis,
                photo: imageUrl
            })
            .eq('id', id);
        if (showError) {
            console.error('Error updating show:', showError);
            return;
        }
        await supabase.from('showXactor').delete().eq('idShow', id);
        for (const actor of cast) {
            const { error: actorError } = await supabase
                .from('showXactor')
                .insert([{ idShow: id, idActor: actor.id }]);
            if (actorError) {
                console.error('Error updating showXactor:', actorError);
                return;
            }
        }
        await supabase.from('showXcategory').delete().eq('idShow', id);
        for (const genre of genres) {
            const { error: genreError } = await supabase
                .from('showXcategory')
                .insert([{ idShow: id, idCategory: genre.id }]);
            if (genreError) {
                console.error('Error updating showXcategory:', genreError);
                return;
            }
        }
        await supabase.from('showXdirector').delete().eq('idShow', id);
        for (const director of showDirectors) {
            const { error: directorError } = await supabase
                .from('showXdirector')
                .insert([{ idShow: id, idDirector: director.id }]);
            if (directorError) {
                console.error('Error updating showXdirector:', directorError);
                return;
            }
        }
        const { data: seasonsData, error: seasonsError } = await supabase
        .from('season')
        .select('id')
        .eq('idShow', id);

        if (seasonsError) {
            console.error('Error fetching seasons:', seasonsError);
            return;
        }

        for (const season of seasonsData) {
            // Elimina todos los episodios asociados a esta temporada
            const { error: episodesError } = await supabase
                .from('episode')
                .delete()
                .eq('idSeason', season.id);

            if (episodesError) {
                console.error('Error deleting episodes:', episodesError);
                return;
            }

            // Elimina la temporada
            const { error: seasonError } = await supabase
                .from('season')
                .delete()
                .eq('id', season.id);

            if (seasonError) {
                console.error('Error deleting season:', seasonError);
                return;
            }
        }

        // Inserta las nuevas temporadas y episodios
        for (const season of seasons) {
            const { data: seasonData, error: seasonError } = await supabase
                .from('season')
                .insert({
                    idShow: id,
                    numberOfSeason: season.numberOfSeason
                })
                .select();

            if (seasonError) {
                console.error('Error adding season:', seasonError);
                return;
            }

            const seasonId = seasonData[0].id;

            for (const episode of season.episodes) {
                const { error: episodeError } = await supabase
                    .from('episode')
                    .insert({
                        idSeason: seasonId,
                        name: episode.name,
                        sinopsis: episode.sinopsis,
                        duration: episode.duration
                    });

                if (episodeError) {
                    console.error('Error adding episode:', episodeError);
                    return;
                }
            }
        }
        alert('Show updated successfully!');
        //navigate('/');
    };

    const addSeason = () => {
        const newSeason = {
            id: seasons.length + 1,
            numberOfSeason: seasons.length + 1,
            episodes: [],
        };
        setSeasons([...seasons, newSeason]);
    };

    const addEpisode = (seasonId) => {
        const updatedSeasons = seasons.map((season) => {
            if (season.id === seasonId) {
                const newEpisode = {
                    id: season.episodes.length + 1,
                    name: '',
                    sinopsis: '',
                    duration: '',
                };
                return { ...season, episodes: [...season.episodes, newEpisode] };
            }
            return season;
        });
        setSeasons(updatedSeasons);
    };

    const handleEpisodeChange = (seasonId, episodeId, field, value) => {
        const updatedSeasons = seasons.map((season) => {
            if (season.id === seasonId) {
                const updatedEpisodes = season.episodes.map((episode) => {
                    if (episode.id === episodeId) {
                        return { ...episode, [field]: value };
                    }
                    return episode;
                });
                return { ...season, episodes: updatedEpisodes };
            }
            return season;
        });
        setSeasons(updatedSeasons);
    };

    const removeSeason = (seasonId) => {
        const updatedSeasons = seasons.filter((season) => season.id !== seasonId);
        setSeasons(updatedSeasons);
    };
    
    const removeEpisode = (seasonId, episodeId) => {
        const updatedSeasons = seasons.map((season) => {
            if (season.id === seasonId) {
                return { ...season, episodes: season.episodes.filter(episode => episode.id !== episodeId) };
            }
            return season;
        });
        setSeasons(updatedSeasons);
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
                            value={showDetails.name}
                            onChange={(e) => setShowDetails({ ...showDetails, name: e.target.value })}
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
                <div className="bg-[#1A1A1A] p-6 rounded-lg lg:col-span-2 ">
                    <h3 className="text-lg font-semibold">Description</h3>
                    <Textarea  
                        className="w-full bg-gray-700 bg-inherit p-4 rounded-lg mt-2" 
                        value={showDetails.sinopsis}
                        onChange={(e) => setShowDetails({ ...showDetails, sinopsis: e.target.value })}
                    />
                </div>
                <div className="bg-[#1A1A1A] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Cast</h3>
                    <div className="flex flex-col gap-2 mt-2">
                        {cast.map((member, index) => (
                            <Button onClick={() => setCast(cast.filter((g) => g.id !== member.id))} key={index} className="bg-[#141414] p-2 rounded">{member.name}</Button>
                        ))}
                        <Button variant="outline" className="bg-[#141414] p-2 rounded" onClick={() => setCastModalIsOpen(true)}>Add Cast Member</Button>
                    </div>
                </div>
                <div className="bg-[#1A1A1A] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Released Year</h3>
                    <DatePicker
                        selected={showDetails.releaseDate}
                        onChange={(date) => setShowDetails({ ...showDetails, releaseDate: date })}
                        dateFormat="yyyy"
                        showYearPicker
                        placeholderText="Select year"
                        className="bg-[#141414] p-4 w-[75px] h-[40px] rounded-lg mt-2"
                    />
                    <h3 className="text-lg font-semibold mt-6">Price</h3>
                    <Input 
                        type="number" 
                        placeholder="Insert price ($)" 
                        value={showDetails.price}
                        onChange={(e) => setShowDetails({ ...showDetails, price: e.target.value })}
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
                        {showDirectors.map((director, index) => (
                            <Button onClick={() => setShowDirectors(showDirectors.filter((g) => g.id !== director.id))} key={index} className="bg-[#141414] p-2 rounded">{director.name}</Button>
                        ))}
                        <Button variant="outline" className="bg-[#141414] p-2 rounded" onClick={() => setDirectorModalIsOpen(true)}>Add Director</Button>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Button className="bg-red-600 p-4 rounded-lg" onClick={handleUpdateShow}>Update Show</Button>
                    </div>
                </div>
            </div>
            <div className="bg-[#1A1A1A] w-[1596px] mx-auto mt-8">
                <h3 className="text-lg font-semibold mb-4">Seasons and Episodes</h3>
                {seasons.map((season) => (
                    <div key={season.id} className="mt-4">
                        <div className="flex justify-between items-center bg-inherit p-2 rounded">
                            <h4 className="text-md font-semibold">Season {season.numberOfSeason}</h4>
                            <div className="flex space-x-2">
                                <Button variant="outline" className="bg-[#141414] p-2 rounded" onClick={() => addEpisode(season.id)}>Add Episode</Button>
                                <Button variant="outline" className="bg-[#E50000] p-2 rounded" onClick={() => removeSeason(season.id)}>Remove Season</Button>
                            </div>
                        </div>
                        {season.episodes.map((episode) => (
                            <div key={episode.id} className="mt-2 p-2 rounded bg-inherit">
                                <div className="flex flex-col">
                                    <Input
                                        type="text"
                                        placeholder="Episode Title"
                                        className="bg-[#141414] p-2 rounded mt-2"
                                        value={episode.name}
                                        onChange={(e) => handleEpisodeChange(season.id, episode.id, 'name', e.target.value)}
                                    />
                                    <Textarea
                                        placeholder="Episode Synopsis"
                                        className="bg-[#141414] p-2 rounded mt-2"
                                        value={episode.sinopsis}
                                        onChange={(e) => handleEpisodeChange(season.id, episode.id, 'sinopsis', e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Duration (minutes)"
                                        className="bg-[#141414] p-2 rounded mt-2"
                                        value={episode.duration}
                                        onChange={(e) => handleEpisodeChange(season.id, episode.id, 'duration', e.target.value)}
                                    />
                                    <Button variant="outline" className="bg-[#E50000] p-2 rounded mt-2" onClick={() => removeEpisode(season.id, episode.id)}>Remove</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <Button variant="outline" className="bg-[#141414] p-2 rounded" onClick={addSeason}>Add Season</Button>
            </div>
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

export default EditShow;

