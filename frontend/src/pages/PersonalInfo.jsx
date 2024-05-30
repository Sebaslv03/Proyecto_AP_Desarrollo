import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import image from '../images/profilepic.png';
import Header from '../components/Header';
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const PersonalInfo = () => {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [community, setCommunity] = useState('');
  const [birthdate, setBirthdate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationality, setNationality] = useState(null);
  const [genre, setGenre] = useState('');
  const [nationalities, setNationalities] = useState([]);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePath, setImagePath] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPersonalInfo();
    fetchNationalities();
    fetchGenres();
  }, []);

  const fetchNationalities = async () => {
    const { data, error } = await supabase
      .from('nationality')
      .select('*');
    if (error) console.error('Error fetching nationalities:', error);
    else setNationalities(data);
  };

  const fetchGenres = async () => {
    const { data, error } = await supabase
      .from('genre')
      .select('*');
    if (error) console.error('Error fetching genres:', error);
    else setGenres(data);
  };

  const historyView = async () => {
    navigate('/History'); 
  }

  const saveInputs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("User not authenticated");
        return;
      }
  
      const { error } = await supabase
        .from('person')
        .update({
          name: firstName,
          secondName: secondName,
          lastName: lastName,
          secondLastName: secondLastName,
          idNumber: idNumber,
          phoneNumber: phoneNumber,
          nationality: nationality,
          community: community,
          birthDate: birthdate,
          photo: imageUrl
        })
        .eq('email', user.email);
  
      if (error) {
        throw error;
      }
  
      alert("Personal information updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchPersonalInfo = async () => {
    try {
      const {data: { user },} = await supabase.auth.getUser()
    
      if (error || !user) {
        navigate('/');
        return;
      }
  
  
      const { data, error: fetchError } = await supabase
        .from('person')
        .select('*')
        .eq('email', user.email);



  
      if (fetchError) {
        throw fetchError;
      }

      const name = data[0].name;
      setFirstName(name);

      const secondName = data[0].secondName;
      setSecondName(secondName);

      const lastName = data[0].lastName;
      setLastName(lastName);
      
      const secondLastName = data[0].secondLastName;
      setSecondLastName(secondLastName);

      const idNumber = data[0].idNumber;
      setIdNumber(idNumber);

      const phoneNumber = data[0].phoneNumber;
      setPhoneNumber(phoneNumber);

      const nationality = data[0].nationality;
      setNationality(nationality);

      const community = data[0].community;
      setCommunity(community);

      const birthdate = data[0].birthDate;
      setBirthdate(birthdate);

      const imageUrl = data[0].photo;
      setImageUrl(imageUrl);

    } catch (error) {
      setError(error.message);
    }
    
  };

  

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Header />
      <div className="container mx-auto py-10 px-4">
        <h2 className="text-center text-4xl font-bold mb-10">Personal Information</h2>
        
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <label htmlFor="photo-upload" className="block mb-2 cursor-pointer">
              <img src={imageUrl || image} alt="Add Photo" className="h-40 w-40 mx-auto rounded-full" />
            </label>
            <input type="file" id="photo-upload" className="hidden" value={imagePath} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
        </div>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter Name"
            className="w-full p-2 rounded bg-[#222] border border-[#333] text-white"
          />
        </div>
        <div>
          <label htmlFor="second-name" className="block mb-2">Second Name</label>
          <input
            type="text"
            id="second-name"
            value={secondName}
            onChange={(e) => setSecondName(e.target.value)}
            placeholder="Enter First Last Name"
            className="w-full p-2 rounded bg-[#222] border border-[#333] text-white"
          />
        </div>
          <div>
            <label htmlFor="first-last-name" className="block mb-2">First Last Name</label>
            <input
              type="text"
              id="first-last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter First Last Name"
              className="w-full p-2 rounded bg-[#222] border border-[#333] text-white"
            />
          </div>
          <div>
            <label htmlFor="second-last-name" className="block mb-2">Second Last Name</label>
            <input
              type="text"
              id="second-last-name"
              value={secondLastName}
              onChange={(e) => setSecondLastName(e.target.value)}
              placeholder="Enter Second Last Name"
              className="w-full p-2 rounded bg-[#222] border border-[#333] text-white"
            />
          </div>
          <div>
              <label htmlFor="nationality" className="block mb-2">Nationality</label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
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
            <input
              type="text"
              id="id"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Enter ID or passport"
              className="w-full p-2 rounded bg-[#222] border border-[#333] text-white"
            />
          </div>
          <div>
            <label htmlFor="community" className="block mb-2">Community</label>
            <input
              type="text"
              id="community"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              placeholder="Enter your community"
              className="w-full p-2 rounded bg-[#222] border border-[#333] text-white"
            />
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
            <div className="flex space-x-2">
              <input
                type="text"
                id="phone-number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter Phone Number"
                className="w-full p-2 rounded bg-[#222] border border-[#333] text-white"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-left mt-8">
            <button type="submit" className="w-40 max-w-xs p-2 rounded bg-[#e50914] text-white" onClick={historyView}> View my history</button>
            </div>          
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button type="submit" className="w-full max-w-xs p-2 rounded bg-[#e50914] text-white" onClick={saveInputs} > Save changes</button>
        </div>

        <div className="text-center mt-4">
          <p> <a href="/HomePage" className="text-white">Go back to main</a></p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;

