import React, { useState } from 'react';
//import { useHistory } from 'react-router-dom'; // Importa useHistory para redireccionar después del inicio de sesión
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import image from '../images/logo.png'


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { email, password } = formData;

    try {
      // Iniciar sesión con correo electrónico y contraseña
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Si el inicio de sesión es exitoso, redirige al usuario a la página de inicio
      navigate('/HomePage'); // Cambia la ruta según tu necesidad
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div>
      <div className="flex h-screen bg-[#1E1E1E] text-[18px]">
        <div className="flex-1 flex justify-center items-center">
          <img src={image} alt="Background" className="w-1/2 h-auto rounded" />
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 text-white">
          <h1 class="text-5xl font-bold text-white mb-4">Welcome!</h1>
          <p className="mb-6">
            Log in to enjoy more of ShowSeeker and discover extended functionalities.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-96 p-2 rounded bg-[#222] border border-[#333] text-white"
                required
              />
            </div>
            <div className="mb-4 ">
              <label htmlFor="password" className="block mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className=" w-96 p-2 rounded bg-[#222] border border-[#333] text-white"
                required
              />
            </div>
            <button type="submit" className="items-center w-80 p-2 rounded bg-[#e50914] text-white" onClick={handleSubmit}>Log In</button>
          </form>
          <a href="/ForgotPassword" className="block mt-4  text-white">Forgot Password?</a>
          <p className="mt-4 ">
            No Account? <a href="/Register" className="text-[#e50914]">Create One!</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
