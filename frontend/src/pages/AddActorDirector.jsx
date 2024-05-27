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

Modal.setAppElement('#root'); // Asegúrate de que el root ID es correcto

async function uploadImage(file) {
    console.log("The image is uploading to the DB...")
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
    console.log("Retrieving information from the photo...")
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
    const [role, setRole] = useState('actor');

    useEffect(() => {
        fetchNationalities();
    }, []);

    const fetchNationalities = async () => {
        const { data, error } = await supabase
            .from('nationality')
            .select('*');
        if (error) console.error('Error fetching nationalities:', error);
        else setNationalities(data);
    };

    const addFamilyMember = () => {
        if (newFamilyMember) {
            setFamilyMembers([...familyMembers, newFamilyMember]);
            setNewFamilyMember('');
        }
    };

    const handleAddActorDirector = async () => {
        let tableName = role === 'actor' ? 'actor' : 'director';

        // Inserción del actor/director
        const { data: actorDirectorData, error: actorDirectorError } = await supabase
            .from(tableName)
            .insert([
                {
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
                }
            ])
            .select();  // Seleccionar los datos insertados

        if (actorDirectorError) {
            console.error(`Error adding ${role}:`, actorDirectorError);
            return;
        }

        const actorDirectorId = actorDirectorData[0].id;

        // Inserción de los datos de la familia
        const familyData = familyMembers.map(member => ({
            idActorDirector: actorDirectorId,
            name: member
        }));

        if (role === 'actor'){
            const { error: familyError } = await supabase
            .from('familyMemberActor')
            .insert(familyData);
            if (familyError) {
                console.error('Error adding family members:', familyError);
            } else {
                alert(`${role.charAt(0).toUpperCase() + role.slice(1)} and family members added successfully!`);
            }
        } else {
            const { error: familyError } = await supabase
            .from('familyMemberDirector')
            .insert(familyData);
            if (familyError) {
                console.error('Error adding family members:', familyError);
            } else {
                alert(`${role.charAt(0).toUpperCase() + role.slice(1)} and family members added successfully!`);
        }
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
        alert("Image uploaded succesfully")
    };

    const handleDeleteImage = async () => {
        if (imagePath) {
            await deleteImage(imagePath);
            setImageUrl('');
            setImagePath(null);
        }
        alert("Image deleted succesfully")
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
                        className="w-full bg-[#141414] p-4 w-[300px] h-[40px] rounded-lg mt-2"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                    <div className="mt-8 flex justify-center">
                        <Button className="bg-red-600 p-4 rounded-lg" onClick={handleAddActorDirector}>Add Actor/Director</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Movie;
