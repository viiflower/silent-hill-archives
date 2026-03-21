import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Asegúrate de que esta ruta sea correcta para tu gif de Heather
import charactersBg from "../assets/silenthill3login.gif";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [showForm, setShowForm] = useState(false); // Estado para ocultar/mostrar formulario
  const [showList, setShowList] = useState(false); // Estado para ocultar/mostrar lista
  
  // Estados para el formulario
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
      await axios.post(API_URL, {
        name: name.toUpperCase(),
        status: status.toUpperCase(),
        description
      });
      // Limpiar y ocultar formulario tras guardar
      setName(''); setStatus(''); setDescription('');
      setShowForm(false);
      fetchCharacters(); // Recargar lista
    } catch (err) {
      alert("ERROR_IN_ARCHIVE_PROCESS");
    }
  };

  // Estilos comunes para inputs transparentes
  const inputStyle = "bg-transparent border-b border-zinc-700 w-full p-2 text-white focus:border-white outline-none transition-colors placeholder:text-zinc-600 uppercase text-sm";

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-x-hidden">
      {/* 1. GIF DE FONDO (Más visible) */}
      <img src={charactersBg} alt="background" className="fixed inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none" />
      
      {/* 2. NAVEGACIÓN (Botones Blancos) */}
      <div className="fixed top-0 left-0 w-full bg-black/50 z-[100] border-b border-zinc-900 px-6 py-3 flex justify-between items-center backdrop-blur-sm">
        <nav className="flex gap-6">
          <Link to="/characters" className="text-white font-bold uppercase tracking-widest text-sm p-1 border-b-2 border-white"> [ Characters ] </Link>
          <Link to="/monsters" className="text-white/70 hover:text-white transition-colors uppercase tracking-widest text-sm p-1 border-b-2 border-transparent hover:border-white/50"> [ Monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] text-zinc-400 hover:text-red-600 uppercase tracking-[0.2em] transition-colors"> :: Logout :: </button>
      </div>

      {/* 3. CONTENIDO PRINCIPAL (Transparente) */}
      <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.4em] text-center mb-12 uppercase text-white font-bold opacity-80">S.H._DATABASE_PERSONNEL</h1>

        {/* CONTROLES CRUD (Minimalistas) */}
        <div className="flex gap-4 mb-10 z-20">
          <button 
            onClick={() => { setShowForm(!showForm); setShowList(false); }}
            className={`px-5 py-2 border uppercase text-xs tracking-widest transition-all ${showForm ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'}`}
          >
            {showForm ? '[ Cancel_Entry ]' : '[ Add_New_Entity ]'}
          </button>
          
          <button 
            onClick={() => { setShowList(!showList); setShowForm(false); }}
            className={`px-5 py-2 border uppercase text-xs tracking-widest transition-all ${showList ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'}`}
          >
            {showList ? '[ Hide_Database ]' : '[ View_Database ]'}
          </button>
        </div>

        {/* A. FORMULARIO TRANSPARENTE (Solo visible si showForm es true) */}
        {showForm && (
          <section className="relative z-[60] w-full max-w-xl bg-black/80 border border-zinc-800 p-8 shadow-2xl backdrop-blur-md mb-12 animation-fade-in">
            <h2 className="text-white text-xl tracking-[0.3em] text-center border-b border-zinc-900 pb-4 uppercase mb-8 font-bold">:: New_Archive_Entry ::</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="NAME" required />
                <input value={status} onChange={(e) => setStatus(e.target.value)} className={inputStyle} placeholder="STATUS" required />
              </div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className={`${inputStyle} resize-none`} placeholder="OBSERVATIONS" required></textarea>
              <button type="submit" className="border border-white/20 p-3 text-white/60 hover:bg-white hover:text-black hover:border-white transition-all uppercase font-bold tracking-[0.2em] text-sm mt-4">Archive_Data_Entry</button>
            </form>
          </section>
        )}

        {/* B. LISTA DE DATOS TRANSPARENTE (Solo visible si showList es true) */}
        {showList && (
          <div className="grid grid-cols-1 gap-6 w-full max-w-5xl mx-auto mb-20 animation-fade-in">
            {characters.length === 0 ? (
              <p className="text-center text-zinc-600 uppercase text-xs tracking-widest py-10">-- NO_RECORDS_FOUND --</p>
            ) : (
              characters.map((char) => (
                <div key={char.id} className="bg-black/60 border border-zinc-900 p-5 flex flex-col md:flex-row gap-5 shadow-lg backdrop-blur-sm hover:border-zinc-700 transition-colors">
                  <div className="w-full md:w-32 h-32 bg-zinc-950 border border-zinc-800 flex-shrink-0 overflow-hidden text-center flex items-center justify-center">
                    {char.imageurl ? (
                      <img src={char.imageurl} alt={char.name} className="w-full h-full object-cover grayscale brightness-75 contrast-125" />
                    ) : (
                      <span className="text-zinc-800 text-xs">NO_IMG</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-xl tracking-widest uppercase text-white font-bold">{char.name}</h2>
                    <p className="text-zinc-500 text-xs mb-3">STATUS: {char.status}</p>
                    <p className="text-zinc-300 leading-relaxed text-sm italic border-l-2 border-zinc-800 pl-4">{char.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Characters;