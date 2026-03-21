import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fog from "../assets/silenthill2fog.gif"; 

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // URL CORREGIDA: Se eliminó "-backend" según el error de red
  const API_URL = "https://silent-hill-archives.onrender.com"; 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        username: username.toUpperCase(), 
        password
      });
      if (response.status === 200) {
        localStorage.setItem('user', username.toUpperCase());
        navigate('/characters');
      }
    } catch (error) {
      alert("ERROR: IDENTIDAD NO ENCONTRADA");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        username: username.toUpperCase(),
        password
      });
      if (response.status === 201 || response.status === 200) {
        alert("REGISTRO EXITOSO: INICIE CONEXIÓN");
        setIsRegistering(false);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      alert("ERROR: NO SE PUDO CREAR EL ARCHIVO");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black font-mono">
      <img src={fog} alt="fog" className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" />

      <div className="relative z-[60] w-full max-w-md bg-white border-4 border-zinc-900 p-10 shadow-2xl">
        <h2 className="text-black text-2xl tracking-tighter text-center border-b-2 border-zinc-900 pb-4 uppercase font-bold mb-6">
          {isRegistering ? "NEW_ARCHIVE_SYSTEM" : "IDENTIFY_PERSONNEL"}
        </h2>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 text-[10px] uppercase font-bold text-left">User_Identity</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              /* TEXT-BLACK para que lo que escribas sea negro */
              className="bg-zinc-100 border-2 border-zinc-900 p-3 text-black font-bold outline-none focus:bg-white uppercase"
              placeholder="NAME_HERE"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 text-[10px] uppercase font-bold text-left">Access_Key</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              /* TEXT-BLACK para que la contraseña sea visible al escribir */
              className="bg-zinc-100 border-2 border-zinc-900 p-3 text-black font-bold outline-none focus:bg-white"
              placeholder="********"
              required
            />
          </div>

          <button type="submit" className="bg-zinc-900 py-4 text-white hover:bg-red-900 transition-colors uppercase font-bold tracking-widest text-sm">
            {isRegistering ? "SAVE_DATA" : "CONNECT"}
          </button>
        </form>

        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="mt-6 text-zinc-900 text-[10px] uppercase underline font-bold hover:text-red-700"
        >
          {isRegistering ? "RETURN_TO_LOGIN" : "CREATE_NEW_ACCOUNT"}
        </button>
      </div>
    </div>
  );
};

export default Login;