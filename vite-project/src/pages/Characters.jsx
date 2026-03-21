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
      // usamos 'image' porque asi se llama en tu tabla de sql
      await axios.post(API_URL, {
        name: name.toUpperCase(),
        status: status.toUpperCase(),
        description: description,
        image: imageurl
      });
      setName(''); setStatus(''); setImageurl(''); setDescription('');
      setShowForm(false);
      fetchCharacters();
    } catch (err) {
      alert("server_error_500: error al guardar en la base de datos");
    }
  };

  const inputStyle = "bg-white border-2 border-zinc-300 w-full p-3 text-black outline-none uppercase text-sm font-bold placeholder:text-zinc-500";

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono">
      <img src={charactersBg} className="fixed inset-0 w-full h-full object-cover opacity-60 z-0" />
      
      <div className="fixed top-0 left-0 w-full bg-black/60 z-[100] border-b border-zinc-900 px-6 py-3 flex justify-between items-center backdrop-blur-md">
        <nav className="flex gap-6">
          <Link to="/characters" className="text-white font-bold uppercase tracking-widest text-sm p-1 border-b-2 border-white"> [ characters ] </Link>
          <Link to="/monsters" className="text-white/70 hover:text-white transition-colors uppercase tracking-widest text-sm p-1 border-b-2 border-transparent"> [ monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] text-white hover:text-red-600 uppercase tracking-[0.2em]"> :: logout :: </button>
      </div>

      <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.4em] mb-12 uppercase font-bold text-center">s.h._database_personnel</h1>

        <div className="flex gap-4 mb-10 z-20">
          <button onClick={() => { setShowForm(!showForm); setShowList(false); }} className={`px-5 py-2 border-2 uppercase text-xs font-bold ${showForm ? 'bg-red-700 text-white' : 'bg-white text-black'}`}> [ add_new_entity ] </button>
          <button onClick={() => { setShowList(!showList); setShowForm(false); }} className={`px-5 py-2 border-2 uppercase text-xs font-bold ${showList ? 'bg-red-700 text-white' : 'bg-white text-black'}`}> [ view_database ] </button>
        </div>

        {showForm && (
          <section className="w-full max-w-xl bg-white p-8 mb-12 border-4 border-zinc-900 animation-fade-in">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="name" required />
              <input value={status} onChange={(e) => setStatus(e.target.value)} className={inputStyle} placeholder="status" required />
              <input value={imageurl} onChange={(e) => setImageurl(e.target.value)} className={inputStyle} placeholder="image_url" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className={inputStyle} placeholder="observations" required></textarea>
              <button type="submit" className="bg-black text-white p-4 font-bold uppercase">archive_data_entry</button>
            </form>
          </section>
        )}

        {showList && (
          <div className="w-full max-w-5xl mx-auto mb-20">
            {characters.length === 0 ? (
              <p className="text-center py-20 border border-dashed border-zinc-800 text-zinc-500">-- no_entities_registered --</p>
            ) : (
              characters.map((char) => (
                <div key={char.char_id} className="bg-black/80 border border-white p-5 flex gap-5 mb-4 backdrop-blur-sm">
                  <div className="w-32 h-32 bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden">
                    <img src={char.image} className="w-full h-full object-cover grayscale" alt={char.name} />
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-xl uppercase font-bold text-white">{char.name}</h2>
                    <p className="text-zinc-400 text-xs uppercase">status: {char.status}</p>
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