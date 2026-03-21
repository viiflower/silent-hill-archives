import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import charactersBg from "../assets/silenthill3login.gif";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  
  // Estados para los 4 datos que pide tu base de datos
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [imageurl, setImageurl] = useState('');
  const [description, setDescription] = useState('');

  const API_URL = 'https://silent-hill-archives.onrender.com/api/characters';

  const fetchCharacters = async () => {
    try {
      const res = await axios.get(API_URL);
      setCharacters(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setCharacters([]);
    }
  };

  useEffect(() => { fetchCharacters(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviamos los 4 campos exactos que requiere el servidor
      await axios.post(API_URL, {
        name: name.toUpperCase(),
        status: status.toUpperCase(),
        imageurl: imageurl, // Aquí se envía el link que pegues
        description: description
      });
      
      // Limpiar formulario y cerrar
      setName(''); setStatus(''); setImageurl(''); setDescription('');
      setShowForm(false);
      fetchCharacters();
    } catch (err) {
      alert("SERVER_ERROR_500: Revisa que el link de la imagen sea válido.");
    }
  };

  const inputStyle = "bg-white border-2 border-zinc-300 w-full p-3 text-black focus:border-black outline-none uppercase text-sm font-bold placeholder:text-zinc-500";

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono">
      <img src={charactersBg} className="fixed inset-0 w-full h-full object-cover opacity-60 z-0" />
      
      <div className="fixed top-0 left-0 w-full bg-black/60 z-[100] border-b border-zinc-900 px-6 py-3 flex justify-between items-center backdrop-blur-md">
        <nav className="flex gap-6">
          <Link to="/characters" className="text-white font-bold uppercase tracking-widest text-sm p-1 border-b-2 border-white"> [ Characters ] </Link>
          <Link to="/monsters" className="text-white/70 hover:text-white transition-colors uppercase tracking-widest text-sm p-1 border-b-2 border-transparent"> [ Monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] text-white hover:text-red-600 uppercase tracking-[0.2em]"> :: Logout :: </button>
      </div>

      <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.4em] mb-12 uppercase font-bold">S.H._DATABASE_PERSONNEL</h1>

        <div className="flex gap-4 mb-10 z-20">
          <button onClick={() => { setShowForm(!showForm); setShowList(false); }} className={`px-5 py-2 border-2 uppercase text-xs font-bold transition-all ${showForm ? 'bg-red-700 text-white border-red-700' : 'bg-white text-black border-white'}`}>
            {showForm ? '[ Cancel_Entry ]' : '[ Add_New_Entity ]'}
          </button>
          <button onClick={() => { setShowList(!showList); setShowForm(false); }} className={`px-5 py-2 border-2 uppercase text-xs font-bold transition-all ${showList ? 'bg-red-700 text-white border-red-700' : 'bg-white text-black border-white'}`}>
            {showList ? '[ Hide_Database ]' : '[ View_Database ]'}
          </button>
        </div>

        {showForm && (
          <section className="w-full max-w-xl bg-white p-8 shadow-2xl mb-12 border-4 border-zinc-900 animation-fade-in">
            <h2 className="text-black text-center border-b-2 border-zinc-200 pb-4 uppercase mb-8 font-bold tracking-widest">:: New_Archive_Entry ::</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="NAME" required />
              <input value={status} onChange={(e) => setStatus(e.target.value)} className={inputStyle} placeholder="STATUS (Ex: Missing/Alive)" required />
              <input value={imageurl} onChange={(e) => setImageurl(e.target.value)} className={inputStyle} placeholder="PASTE_IMAGE_URL_HERE" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className={`${inputStyle} resize-none`} placeholder="OBSERVATIONS" required></textarea>
              <button type="submit" className="bg-black text-white p-4 hover:bg-red-900 transition-all uppercase font-bold tracking-widest">Archive_Data_Entry</button>
            </form>
          </section>
        )}

        {showList && (
          <div className="w-full max-w-5xl mx-auto mb-20 animation-fade-in">
            {characters.length === 0 ? (
              <p className="text-center text-zinc-500 uppercase text-xs tracking-[0.3em] py-20 bg-black/40 border border-dashed border-zinc-800">-- NO_ENTITIES_REGISTERED --</p>
            ) : (
              characters.map((char) => (
                <div key={char.id} className="bg-black/80 border border-white p-5 flex gap-5 mb-4 backdrop-blur-sm">
                  <div className="w-32 h-32 bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden">
                    {char.imageurl ? (
                      <img src={char.imageurl} alt={char.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold">NO_IMG</div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-xl uppercase font-bold text-white">{char.name}</h2>
                    <p className="text-zinc-400 text-xs uppercase">STATUS: {char.status}</p>
                    <p className="text-zinc-200 text-sm italic mt-2 border-l-2 border-zinc-800 pl-4">{char.description}</p>
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