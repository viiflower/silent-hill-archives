import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import charactersBg from "../assets/silenthill3login.gif";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  const API_URL = 'https://silent-hill-archives.onrender.com/api/characters';

  const fetchCharacters = async () => {
    try {
      const res = await axios.get(API_URL);
      setCharacters(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviamos un string vacío en imageurl para evitar el error 500 si el servidor la requiere
      await axios.post(API_URL, {
        name: name.toUpperCase(),
        status: status.toUpperCase(),
        description: description,
        imageurl: "" 
      });
      setName(''); setStatus(''); setDescription('');
      setShowForm(false);
      fetchCharacters();
    } catch (err) {
      console.error(err);
      alert("SERVER_ERROR_500: Verificando conexión con base de datos...");
    }
  };

  // ESTILO DE INPUT: Fondo blanco, texto negro para que se vea perfecto
  const inputStyle = "bg-white border-b-2 border-zinc-400 w-full p-3 text-black focus:border-black outline-none transition-colors placeholder:text-zinc-400 uppercase text-sm font-bold";

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-x-hidden">
      <img src={charactersBg} alt="background" className="fixed inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none" />
      
      <div className="fixed top-0 left-0 w-full bg-black/60 z-[100] border-b border-zinc-900 px-6 py-3 flex justify-between items-center backdrop-blur-md">
        <nav className="flex gap-6">
          {/* BOTONES DE NAVEGACIÓN BLANCOS */}
          <Link to="/characters" className="text-white font-bold uppercase tracking-widest text-sm p-1 border-b-2 border-white"> [ Characters ] </Link>
          <Link to="/monsters" className="text-white hover:text-zinc-300 transition-colors uppercase tracking-widest text-sm p-1 border-b-2 border-transparent"> [ Monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] text-white hover:text-red-600 uppercase tracking-[0.2em]"> :: Logout :: </button>
      </div>

      <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.4em] text-center mb-12 uppercase text-white font-bold">S.H._DATABASE_PERSONNEL</h1>

        <div className="flex gap-4 mb-10 z-20">
          {/* BOTONES DE ACCIÓN BLANCOS */}
          <button onClick={() => { setShowForm(!showForm); setShowList(false); }} className={`px-5 py-2 border-2 uppercase text-xs tracking-widest font-bold transition-all ${showForm ? 'bg-red-700 border-red-700 text-white' : 'bg-white border-white text-black hover:bg-zinc-200'}`}>
            {showForm ? '[ Cancel_Entry ]' : '[ Add_New_Entity ]'}
          </button>
          
          <button onClick={() => { setShowList(!showList); setShowForm(false); }} className={`px-5 py-2 border-2 uppercase text-xs tracking-widest font-bold transition-all ${showList ? 'bg-red-700 border-red-700 text-white' : 'bg-white border-white text-black hover:bg-zinc-200'}`}>
            {showList ? '[ Hide_Database ]' : '[ View_Database ]'}
          </button>
        </div>

        {showForm && (
          <section className="relative z-[60] w-full max-w-xl bg-white border-4 border-zinc-900 p-8 shadow-2xl mb-12 animation-fade-in">
            <h2 className="text-black text-xl tracking-[0.3em] text-center border-b-2 border-zinc-200 pb-4 uppercase mb-8 font-bold">:: New_Archive_Entry ::</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="NAME" required />
                <input value={status} onChange={(e) => setStatus(e.target.value)} className={inputStyle} placeholder="STATUS" required />
              </div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className={`${inputStyle} resize-none`} placeholder="OBSERVATIONS" required></textarea>
              <button type="submit" className="bg-black p-4 text-white hover:bg-red-900 transition-all uppercase font-bold tracking-[0.2em] text-sm mt-4">Archive_Data_Entry</button>
            </form>
          </section>
        )}

        {showList && (
          <div className="grid grid-cols-1 gap-6 w-full max-w-5xl mx-auto mb-20 animation-fade-in">
            {characters.map((char) => (
              <div key={char.id} className="bg-black/80 border border-white p-5 flex flex-col md:flex-row gap-5 backdrop-blur-sm">
                <div className="w-full md:w-32 h-32 bg-zinc-900 border border-zinc-700 flex-shrink-0 flex items-center justify-center">
                  {char.imageurl ? <img src={char.imageurl} alt={char.name} className="w-full h-full object-cover grayscale" /> : <span className="text-zinc-500 text-[10px]">NO_IMG</span>}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl tracking-widest uppercase text-white font-bold">{char.name}</h2>
                  <p className="text-zinc-400 text-xs mb-2 uppercase">STATUS: {char.status}</p>
                  <p className="text-zinc-200 text-sm italic border-l-2 border-zinc-800 pl-4">{char.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Characters;