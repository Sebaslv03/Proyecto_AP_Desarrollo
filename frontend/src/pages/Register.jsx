import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import image from '../images/profilepic.png';
import Header from '../components/Header';
import supabase from "../config/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

async function uploadImage(file) {
  console.log("The image is uploading to the DB...");
  if (file == null) {
    return null;
  }
  const { data, error } = await supabase
    .storage
    .from("images")
    .upload('person/' + uuidv4(), file);
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

const Register = () => {
  const [nationalities, setNationalities] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [community, setCommunity] = useState('');
  const [birthdate, setBirthdate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePath, setImagePath] = useState('');
  const navigate = useNavigate();

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

  const handleAddPerson = async (e) => {
    e.preventDefault();
    // Registrar usuario
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error('Error during sign up:', signUpError.message);
      return;
    }

    // Iniciar sesión del usuario registrado
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Error during sign in:', signInError.message);
      return;
    }

    const user = signInData.user;

    // Inserción de datos adicionales en la tabla "person"
    const { data, error: insertError } = await supabase
      .from('person')
      .insert([
        {
          //id: user.id,
          name: firstName,
          secondName: secondName,
          lastName: lastName,
          secondLastName: secondLastName,
          nationality: selectedNationality,
          idNumber: idNumber,
          community: community,
          birthDate: birthdate,
          phoneNumber: phoneNumber,
          photo: imageUrl,
        },
      ]);

    if (insertError) {
      console.error('Error inserting additional data:', insertError.message);
      return;
    }

    // Redireccionar a otra página o mostrar un mensaje de éxito
    console.log('User registered and logged in successfully:', data);
    navigate('/HomePage'); // Cambia la ruta según tu necesidad
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Header />
      <div className="container mx-auto py-10 px-4">
        <h2 className="text-center text-4xl font-bold mb-10">Create an account</h2>

        <div className="flex justify-center mb-8">
          <div className="text-center">
            <label htmlFor="photo-upload" className="block mb-2 cursor-pointer">
              <img src={imageUrl || image} alt="Add Photo" className="h-40 w-40 mx-auto rounded-full" />
            </label>
            <input type="file" id="photo-upload" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        <form onSubmit={handleAddPerson}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2">Name</label>
              <Input type="text" id="name" placeholder="Enter Name" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="secondName" className="block mb-2">Second Name</label>
              <Input type="text" id="secondName" placeholder="Enter Second Name" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" value={secondName} onChange={(e) => setSecondName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="first-last-name" className="block mb-2">First Last Name</label>
              <Input type="text" id="first-last-name" placeholder="Enter First Last Name" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="second-last-name" className="block mb-2">Second Last Name</label>
              <Input type="text" id="second-last-name" placeholder="Enter Second Last Name" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" value={secondLastName} onChange={(e) => setSecondLastName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="nationality" className="block mb-2">Nationality</label>
              <select
                value={selectedNationality}
                onChange={(e) => setSelectedNationality(e.target.value)}
                className="w-full p-2 rounded bg-[#222] border border-[#333] text-white"
              >
                <option value="" className='text-white' disabled>Select a nationality</option>
                {nationalities.map((nationality) => (
                  <option className='text-white' key={nationality.id} value={nationality.id}>{nationality.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="id" className="block mb-2">ID or passport</label>
              <Input type="text" id="id" placeholder="Enter ID or passport" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
            </div>
            <div>
              <label htmlFor="community" className="block mb-2">Community</label>
              <Input type="text" id="community" placeholder="Enter your community" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" value={community} onChange={(e) => setCommunity(e.target.value)} />
            </div>
            <div>
              <label htmlFor="birthdate" className="block mb-2">Birthdate</label>
              <DatePicker
                selected={birthdate}
                onChange={(date) => setBirthdate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select your birthdate"
                className="w-full p-2 rounded bg-[#222] border border-[#333] text-white"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                yearDropdownItemNumber={100} // Muestra 100 años en el dropdown
                scrollableYearDropdown // Permite hacer scroll en el dropdown de años
                minDate={new Date(1900, 0, 1)} // Establece la fecha mínima a 1 de enero de 1900
                maxDate={new Date()} // Establece la fecha máxima a la fecha actual
              />
            </div>
            <div>
              <label htmlFor="phone-number" className="block mb-2">Phone Number</label>
              <Input type="text" id="phone-number" placeholder="Enter Phone Number" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">Email</label>
              <Input type="email" id="email" placeholder="Enter your email" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2">Password</label>
              <Input type="password" id="password" placeholder="Enter your password" className="w-full p-2 rounded bg-[#222] border border-[#333] text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button type="submit" className="w-full max-w-xs p-2 rounded bg-[#e50914] text-white" onClick={handleAddPerson}> Register </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p>Already have an account? <a href="/" className="text-[#e50914]">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;


