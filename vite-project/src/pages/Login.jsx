import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fog from "src/assets/silenthill2fog.gif"; 

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_URL = "https://silent-hill-archives.onrender.com"; 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        username: username.toUpperCase(), 
        password
      });
      
      if (response.data) {
        localStorage.setItem('user', username.toUpperCase());
        navigate('/characters');
      }
    } catch (error) {
      console.error(error);
      alert("IDENTIDAD NO RECONOCIDA: REVISE SUS CREDENCIALES");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        username: username.toUpperCase(),
        password
      });
      
      if (response.data) {
        alert("NUEVO ARCHIVO CREADO: INICIE CONEXIÓN");
        setUsername('');
        setPassword('');
        setIsRegistering(false); 
      }
    } catch (error) {
      console.error(error);
      alert("ERROR AL CREAR ARCHIVO: IDENTIDAD YA EXISTENTE");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black font-mono">
      {/* EL GIF DE FONDO */}
      <img 
        src={fog} 
        alt="fog" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 pointer-events-none"
      />

      {/* EL CUADRO DE OPERACIONES CENTRADO (z-index alto para el ruido de fondo) */}
      <div className="relative z-[60] w-full max-w-md bg-zinc-950/90 border-2 border-zinc-900 p-10 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col gap-6">
        
        {/* TÍTULO DINÁMICO */}
        <h2 className="text-white text-2xl tracking-[0.3em] text-center border-b border-zinc-900 pb-6 uppercase font-bold">
          {isRegistering ? "Create_New_Archive" : "Identify_Personnel"}
        </h2>

        {/* MENSAJE RECORDATORIO MAYÚSCULAS (Solo en Registro) */}
        {isRegistering && (
          <p className="text-red-900 text-[10px] text-center uppercase tracking-widest italic bg-red-950/20 py-2">
            Reminder: Identity_Data_Is_Case_Sensitive (UPPERCASE)
          </p>
        )}

        {/* EL FORMULARIO (Se alterna con la función handleSubmit) */}
        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-left">
            <label className="text-zinc-600 text-xs uppercase tracking-widest">
              {isRegistering ? "Specify_Identity" : "Identity"}
            </label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black border border-zinc-800 p-4 text-white placeholder:text-zinc-900 outline-none focus:border-red-900 transition-all uppercase"
              placeholder="ENTER_NAME"
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label className="text-zinc-600 text-xs uppercase tracking-widest">Access_Key</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border border-zinc-800 p-4 text-white placeholder:text-zinc-900 outline-none focus:border-red-900 transition-all"
              placeholder="********"
              required
            />
          </div>

          {/* BOTÓN PRINCIPAL DINÁMICO */}
          <button 
            type="submit" 
            className="border border-zinc-800 py-4 text-zinc-500 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-sm font-bold"
          >
            {isRegistering ? "ARCHIVE_NEW_DATA" : "Establish_Connection"}
          </button>
        </form>

        {/* ENLACE PARA CAMBIAR ENTRE LOGIN Y REGISTRO */}
        <div className="flex flex-col gap-2 mt-4 text-center">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              // Limpiamos los campos al cambiar
              setUsername(''); 
              setPassword('');
            }}
            className="text-zinc-600 hover:text-red-900 text-xs uppercase tracking-widest transition-colors"
          >
            {isRegistering ? "[ Cancel_Operation ]" : "[ Create_New_Archive ]"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;