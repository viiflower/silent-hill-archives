import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fog from "../assets/silenthill2fog.gif"; 

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_URL = "https://silent-hill-archives-backend.onrender.com"; 

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
          alert("NUEVO EXPEDIENTE CREADO");
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
      alert("ERROR: NO SE PUDO ESTABLECER CONEXIÓN");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black font-mono">
      <img src={fog} alt="fog" className="absolute inset-0 w-full h-full object-cover opacity-30 z-0" />

      {/* CUADRO GRIS CLARO PARA QUE EL TEXTO NEGRO RESALTE */}
      <div className="relative z-[60] w-full max-w-md bg-zinc-200 border-4 border-zinc-900 p-10 shadow-2xl">
        <h2 className="text-black text-2xl tracking-tighter text-center border-b-2 border-zinc-900 pb-6 uppercase font-bold mb-6">
          {isRegistering ? "CREATE_NEW_ARCHIVE" : "IDENTIFY_PERSONNEL"}
        </h2>

        <form onSubmit={handleAction} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-left">
            <label className="text-zinc-800 text-[10px] uppercase font-bold">Specify_Identity</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              /* TEXTO NEGRO Y FONDO BLANCO EN EL INPUT */
              className="bg-white border-2 border-zinc-900 p-4 text-black font-bold outline-none focus:border-red-900 uppercase placeholder:text-zinc-400"
              placeholder="ENTER_NAME"
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label className="text-zinc-800 text-[10px] uppercase font-bold">Access_Key</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              /* TEXTO NEGRO PARA QUE SE VEA AL ESCRIBIR */
              className="bg-white border-2 border-zinc-900 p-4 text-black font-bold outline-none focus:border-red-900"
              placeholder="********"
              required
            />
          </div>

          <button type="submit" className="bg-zinc-900 py-4 text-white hover:bg-red-900 transition-colors uppercase font-bold text-sm tracking-widest">
            {isRegistering ? "SAVE_DATA" : "ESTABLISH_CONNECTION"}
          </button>
        </form>

        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="mt-6 text-zinc-900 text-[10px] uppercase underline font-bold hover:text-red-700 block w-full text-center"
        >
          {isRegistering ? "[ CANCEL_OPERATION ]" : "[ CREATE_NEW_ARCHIVE ]"}
        </button>
      </div>
    </div>
  );
};

export default Login;