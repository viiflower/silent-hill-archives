import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fog from "../assets/silenthill2fog.gif"; 

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_URL = "https://silent-hill-archives.onrender.com"; 

  const handleAction = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/api/register' : '/api/login';
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, {
        username: username.toUpperCase(), 
        password
      });
      
      if (response.status === 200 || response.status === 201) {
        if (isRegistering) {
          alert("REGISTRO EXITOSO");
          setIsRegistering(false);
          setUsername('');
          setPassword('');
        } else {
          localStorage.setItem('user', username.toUpperCase());
          navigate('/characters');
        }
      }
    } catch (error) {
      console.error(error);
      alert("ERROR: FALLO EN EL SISTEMA");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black font-mono">
      <img src={fog} alt="fog" className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" />

      <div className="relative z-[60] w-full max-w-md bg-white border-4 border-zinc-900 p-10 shadow-2xl">
        <h2 className="text-black text-2xl tracking-tighter text-center border-b-2 border-zinc-900 pb-4 uppercase font-bold mb-6">
          SILENT HILL ARCHIVE
        </h2>

        <form onSubmit={handleAction} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 text-[10px] uppercase font-bold text-left">SPECIFY_IDENTITY</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ color: '#000000' }}
              className="bg-zinc-100 border-2 border-zinc-900 p-3 text-black font-bold outline-none focus:bg-white uppercase"
              placeholder="ENTER_NAME"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-700 text-[10px] uppercase font-bold text-left">ACCESS_KEY</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ color: '#000000' }}
              className="bg-zinc-100 border-2 border-zinc-900 p-3 text-black font-bold outline-none focus:bg-white"
              placeholder="********"
              required
            />
          </div>

          <button type="submit" className="bg-zinc-900 py-4 text-white hover:bg-red-900 transition-colors uppercase font-bold tracking-widest text-sm">
            {isRegistering ? "SAVE_DATA" : "ESTABLISH_CONNECTION"}
          </button>
        </form>

        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="mt-6 text-zinc-900 text-[10px] uppercase underline font-bold hover:text-red-700 block w-full text-center"
        >
          {isRegistering ? "[ RETURN_TO_LOGIN ]" : "[ CREATE_NEW_ARCHIVE ]"}
        </button>
      </div>
    </div>
  );
};

export default Login;