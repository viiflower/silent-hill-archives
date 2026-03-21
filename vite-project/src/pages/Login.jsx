import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import fog from "../assets/silenthill2fog.gif";

const Login = () => {
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
      alert("IDENTIDAD NO RECONOCIDA O ERROR DE CONEXIÓN");
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

      {/* EL CUADRO DE LOGIN CENTRADO */}
      <form 
        onSubmit={handleLogin} 
        className="relative z-[60] w-full max-w-md bg-zinc-950/90 border-2 border-zinc-900 p-10 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col gap-6"
      >
        <h2 className="text-white text-2xl tracking-[0.3em] text-center border-b border-zinc-900 pb-6 uppercase font-bold">
          Identify_Personnel
        </h2>

        <div className="flex flex-col gap-2 text-left">
          <label className="text-zinc-600 text-xs uppercase tracking-widest">Identity</label>
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

        <div className="flex flex-col gap-4 mt-4">
          <button 
            type="submit" 
            className="border border-zinc-800 py-4 text-zinc-500 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-sm font-bold"
          >
            Establish_Connection
          </button>

          {/* BOTÓN DE CREAR CUENTA REINSTALADO */}
          <Link 
            to="/register" 
            className="text-center text-zinc-600 hover:text-red-900 text-xs uppercase tracking-widest transition-colors"
          >
            [ Create_New_Archive ]
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;