import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../components/HeaderAdmin';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Image } from "lucide-react";
import Modal from 'react-modal';
import supabase from '../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useNavigate } from 'react-router-dom';

Modal.setAppElement('#root'); // Asegúrate de que el root ID es correcto

async function uploadImage(file) {
    console.log("The image is uploading to the DB...");
    if (file == null) {
        return null;
    }
    const { data, error } = await supabase
        .storage
        .from("images")
        .upload('actorsanddirectors/' + uuidv4(), file);
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

const EditActorDirector = () => {
    const { id, role } = useParams();
    const navigate = useNavigate();
    const [releaseDate, setReleaseDate] = useState(null);
    const [nationalities, setNationalities] = useState([]);
    const [selectedNationality, setSelectedNationality] = useState('');
    const [biography, setBiography] = useState('');
    const [trivia, setTrivia] = useState('');
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [lastName, setLastName] = useState('');
    const [secondLastName, setSecondLastName] = useState('');
    const [birthplace, setBirthplace] = useState('');
    const [height, setHeight] = useState('');
    const [familyMembers, setFamilyMembers] = useState([]);
    const [newFamilyMember, setNewFamilyMember] = useState('');
    const [imagePath, setImagePath] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [moviesOrShows, setMoviesOrShows] = useState([]);

    useEffect(() => {
        fetchNationalities();
        fetchActorDirectorDetails();
        fetchMoviesOrShows();
    }, []);

    const fetchNationalities = async () => {
        const { data, error } = await supabase
            .from('nationality')
            .select('*');
        if (error) console.error('Error fetching nationalities:', error);
        else setNationalities(data);
    };

    const fetchActorDirectorDetails = async () => {
        let tableName = role === 'actor' ? 'actor' : 'director';

        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching actor/director details:', error);
            return;
        }

        const details = data;
        setFirstName(details.name);
        setSecondName(details.secondName);
        setLastName(details.lastName);
        setSecondLastName(details.secondLastName);
        setBiography(details.biography);
        setTrivia(details.trivia);
        setReleaseDate(new Date(details.birthDate));
        setSelectedNationality(details.nationality);
        setBirthplace(details.birthPlace);
        setHeight(details.height);
        setImageUrl(details.photo);
        setFamilyMembers(details.familyMembers || []);
    };

    const fetchMoviesOrShows = async () => {
        try {
            let moviesOrShowsData = [];
            if (role === 'actor') {
                const { data: actorMovies, error: actorMoviesError } = await supabase
                    .from('movieXactor')
                    .select('idMovie')
                    .eq('idActor', id);
                    
                if (actorMoviesError) {
                    console.error('Error fetching movie IDs for actor:', actorMoviesError);
                    return;
                }
    
                const { data: actorShows, error: actorShowsError } = await supabase
                    .from('showXactor')
                    .select('idShow')
                    .eq('idActor', id);
    
                if (actorShowsError) {
                    console.error('Error fetching show IDs for actor:', actorShowsError);
                    return;
                }
    
                const movieIDs = actorMovies.map(item => item.idMovie);
                const showIDs = actorShows.map(item => item.idShow);
    
                const { data: movies, error: moviesError } = await supabase
                    .from('movie')
                    .select('*')
                    .in('id', movieIDs);
    
                if (moviesError) {
                    console.error('Error fetching movies:', moviesError);
                    return;
                }
    
                const { data: shows, error: showsError } = await supabase
                    .from('show')
                    .select('*')
                    .in('id', showIDs);
    
                if (showsError) {
                    console.error('Error fetching shows:', showsError);
                    return;
                }
    
                moviesOrShowsData = [...movies, ...shows];
            } else {
                const { data: directorMovies, error: directorMoviesError } = await supabase
                    .from('movieXdirector')
                    .select('idMovie')
                    .eq('idDirector', id);
    
                if (directorMoviesError) {
                    console.error('Error fetching movie IDs for director:', directorMoviesError);
                    return;
                }
    
                const { data: directorShows, error: directorShowsError } = await supabase
                    .from('showXdirector')
                    .select('idShow')
                    .eq('idDirector', id);
    
                if (directorShowsError) {
                    console.error('Error fetching show IDs for director:', directorShowsError);
                    return;
                }
    
                const movieIDs = directorMovies.map(item => item.idMovie);
                const showIDs = directorShows.map(item => item.idShow);
    
                const { data: movies, error: moviesError } = await supabase
                    .from('movie')
                    .select('*')
                    .in('id', movieIDs);
    
                if (moviesError) {
                    console.error('Error fetching movies:', moviesError);
                    return;
                }
    
                const { data: shows, error: showsError } = await supabase
                    .from('show')
                    .select('*')
                    .in('id', showIDs);
    
                if (showsError) {
                    console.error('Error fetching shows:', showsError);
                    return;
                }
    
                moviesOrShowsData = [...movies, ...shows];
            }
    
            setMoviesOrShows(moviesOrShowsData);
        } catch (error) {
            console.error('Error fetching movies/shows:', error);
        }
    };

    const handleItemClick = async (item) => {
        try {
            // Consultar en la tabla de películas
            const { data: movieData, error: movieError } = await supabase
                .from('movie')
                .select('id, title')
                .eq('id', item.id)
                .eq('title', item.title)
                .single();
    
            if (movieError) {
                console.error('Error fetching movie:', movieError);
            } else if (movieData) {
                navigate(`/EditMovie/${item.id}`);
                return;
            }
    
            // Consultar en la tabla de shows
            const { data: showData, error: showError } = await supabase
                .from('show')
                .select('id, name')
                .eq('id', item.id)
                .eq('name', item.name)
                .single();
    
            if (showError) {
                console.error('Error fetching show:', showError);
            } else if (showData) {
                navigate(`/EditShow/${item.id}`);
                return;
            }
    
            // Si no se encuentra en ninguna de las tablas
            console.error('No matching movie or show found.');
        } catch (error) {
            console.error('Error handling item click:', error);
        }
    };

    const addFamilyMember = () => {
        if (newFamilyMember) {
            setFamilyMembers([...familyMembers, newFamilyMember]);
            setNewFamilyMember('');
        }
    };

    const handleUpdateActorDirector = async () => {
        let tableName = role === 'actor' ? 'actor' : 'director';

        // Update actor/director
        const { error: actorDirectorError } = await supabase
            .from(tableName)
            .update({
                name: firstName,
                secondName: secondName,
                lastName: lastName,
                secondLastName: secondLastName,
                photo: imageUrl,
                birthDate: releaseDate,
                nationality: selectedNationality,
                birthPlace: birthplace,
                height: height,
                trivia: trivia,
                biography: biography
            })
            .eq('id', id);

        if (actorDirectorError) {
            console.error(`Error updating ${role}:`, actorDirectorError);
            return;
        }

        // Update family members
        const familyTable = role === 'actor' ? 'familyMemberActor' : 'familyMemberDirector';
        await supabase.from(familyTable).delete().eq('idActorDirector', id);

        const familyData = familyMembers.map(member => ({
            idActorDirector: id,
            name: member
        }));

        const { error: familyError } = await supabase
            .from(familyTable)
            .insert(familyData);

        if (familyError) {
            console.error('Error updating family members:', familyError);
        } else {
            alert(`${role.charAt(0).toUpperCase() + role.slice(1)} and family members updated successfully!`);
        }
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
                    <h3 className="text-lg font-semibold">Biography</h3>
                    <Textarea  
                        className="w-full bg-gray-700 text-[18px] bg-inherit p-4 rounded-lg mt-2"
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)} 
                    />
                </div>

                {/* Div Izquierdo Inferior */}
                <div className="bg-[#1A1A1A] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">Trivia</h3>
                    <div className="flex flex-col gap-2 mt-2">
                        <Textarea  
                            className="w-full h-full bg-gray-700 text-[18px] bg-inherit p-4 rounded-lg mt-2"
                            value={trivia}
                            onChange={(e) => setTrivia(e.target.value)}
                        />
                    </div>
                </div>

                {/* Div Derecho */}
                <div className="bg-[#1A1A1A] p-6 rounded-lg">
                    <h3 className="text-lg font-semibold">First Name</h3>
                    <Input
                        placeholder="Name..."
                        className="w-full bg-[#141414] p-4 h-[40px] rounded-lg mt-2"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <h3 className="text-lg font-semibold">Second Name</h3>
                    <Input
                        placeholder="Name..."
                        className="w-full bg-[#141414] p-4 h-[40px] rounded-lg mt-2"
                        value={secondName}
                        onChange={(e) => setSecondName(e.target.value)}
                    />
                    <h3 className="text-lg font-semibold">Last Name</h3>
                    <Input
                        placeholder="Name..."
                        className="w-full bg-[#141414] p-4 h-[40px] rounded-lg mt-2"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <h3 className="text-lg font-semibold">Second Last Name</h3>
                    <Input
                        placeholder="Name..."
                        className="w-full bg-[#141414] p-4 h-[40px] rounded-lg mt-2"
                        value={secondLastName}
                        onChange={(e) => setSecondLastName(e.target.value)}
                    />
                    <h3 className="text-lg font-semibold mt-6">Date of birth</h3>
                    <DatePicker
                        selected={releaseDate}
                        onChange={(date) => setReleaseDate(date)}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select date"
                        className="w-full h-[40px] bg-[#141414] p-4 rounded-lg mt-2"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        yearDropdownItemNumber={100} // Muestra 100 años en el dropdown
                        scrollableYearDropdown // Permite hacer scroll en el dropdown de años
                        minDate={new Date(1900, 0, 1)} // Establece la fecha mínima a 1 de enero de 1900
                        maxDate={new Date()} // Establece la fecha máxima a la fecha actual
                    />
                    <h3 className="text-lg font-semibold mt-6">Birthplace</h3>
                    <Input
                        placeholder="Name..."
                        className="w-full bg-[#141414] p-4 h-[40px] rounded-lg mt-2"
                        value={birthplace}
                        onChange={(e) => setBirthplace(e.target.value)}
                    />
                    <h3 className="text-lg font-semibold mt-6">Nationality</h3>
                    <select
                        value={selectedNationality}
                        onChange={(e) => setSelectedNationality(e.target.value)}
                        className="w-full bg-[#141414] text-white p-4 rounded-lg mt-2"
                    >
                        <option value="" className='text-white' disabled>Select a nationality</option>
                        {nationalities.map((nationality) => (
                            <option className='text-white' key={nationality.id} value={nationality.id}>{nationality.name}</option>
                        ))}
                    </select>
                    <h3 className="text-lg font-semibold mt-6">Role</h3>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-[#141414] text-white p-4 rounded-lg mt-2"
                        disabled // Deshabilitado para evitar cambios en el rol durante la edición
                    >
                        <option value="actor" className='text-white'>Actor</option>
                        <option value="director" className='text-white'>Director</option>
                    </select>
                    <h3 className="text-lg font-semibold mt-6">Family</h3>
                    <div className="flex flex-col gap-2">
                        {familyMembers.map((member, index) => (
                            <div key={index} className="flex items-center justify-between bg-[#1A1A1A] p-2 rounded-lg mt-2">
                                <span>{member}</span>
                                <Button variant="outline" className="bg-[#E50000] border-1 h-[24px] w-[24px]" size="icon" onClick={() => setFamilyMembers(familyMembers.filter((_, i) => i !== index))}>
                                    <Trash2 className="h-16px w-16px" />
                                </Button>
                            </div>
                        ))}
                        <div className="flex items-center mt-2">
                            <Input
                                placeholder="Family Member..."
                                className="w-full bg-[#141414] p-2 h-[40px] rounded-lg"
                                value={newFamilyMember}
                                onChange={(e) => setNewFamilyMember(e.target.value)}
                            />
                            <Button className="bg-red-600 p-2 h-[40px] rounded-lg ml-2" onClick={addFamilyMember}>Add</Button>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mt-6">Height</h3>
                    <Input 
                        type="number" 
                        placeholder="Insert height (cm)"
                        className="bg-[#141414] p-4 w-[300px] h-[40px] rounded-lg mt-2"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                    <div className="mt-8 flex justify-center">
                        <Button className="bg-red-600 p-4 rounded-lg" onClick={handleUpdateActorDirector}>Update Actor/Director</Button>
                    </div>
                </div>

                {/* Div para películas y shows */}
                <div className="bg-[#1A1A1A] p-6 rounded-lg lg:col-span-2 mt-8">
                    <h3 className="text-lg font-semibold">Movies/Shows</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 w-full mt-4">
                        {moviesOrShows.map((item, index) => (
                            <div 
                                key={index} 
                                className="flex-shrink-0 w-[284px] h-[377px] bg-[#1A1A1A] p-2 rounded-[12px] cursor-pointer flex flex-col items-center justify-between"
                                onClick={() => handleItemClick(item)}
                            >
                                <img src={item.photo} alt={item.title} className="rounded mb-2 w-[243px] h-[281px]" />
                                <h3 className="text-center text-white pb-2">{item.title}</h3>
                                <p className="text-gray-400 text-center rounded-[51px] bg-[#141414] w-[242px] h-[36px] flex items-center justify-center">ID: {item.id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditActorDirector;
