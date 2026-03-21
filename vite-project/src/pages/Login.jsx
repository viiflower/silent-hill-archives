import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fog from "../assets/silenthill2fog.gif";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://tu-api-render.onrender.com/api/login', {
        username: username.toUpperCase(),
        password
      });
      if (response.data.message === "ACCESO_CONCEDIDO") {
        localStorage.setItem('user', response.data.user);
        navigate('/characters');
      }
    } catch (error) {
      alert("IDENTIDAD NO RECONOCIDA");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* EL GIF DE FONDO */}
      <img 
        src={fog} 
        alt="fog" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
      />

      {/* EL CUADRO DE LOGIN SOBRE LA NIEBLA */}
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

        <button type="submit" className="mt-4 border border-zinc-800 py-4 text-zinc-500 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-sm font-bold">
          Establish_Connection
        </button>
      </form>
    </div>
  );
};

export default Login;