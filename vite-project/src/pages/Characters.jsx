import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import charactersBg from "../assets/silenthill3login.gif";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  const fetchCharacters = async () => {
    try {
      // Usamos tu URL real de Render
      const res = await axios.get('https://silent-hill-archives.onrender.com/api/characters');
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
      await axios.post('https://silent-hill-archives.onrender.com/api/characters', {
        name: name.toUpperCase(),
        status: status.toUpperCase(),
        description
      });
      setName(''); setStatus(''); setDescription('');
      fetchCharacters();
    } catch (err) {
      alert("ERROR_IN_ARCHIVE_PROCESS");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-x-hidden">
      {/* MENU DE NAVEGACION */}
      <div className="fixed top-0 left-0 w-full bg-black/60 z-[100] p-4 flex justify-between border-b border-zinc-900 backdrop-blur-sm">
        <div className="flex gap-6">
          <Link to="/characters" className="text-red-700"> [ CHARACTERS ] </Link>
          <Link to="/monsters" className="hover:text-red-700"> [ MONSTERS ] </Link>
        </div>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-zinc-500 hover:text-white"> LOGOUT </button>
      </div>

      <img src={charactersBg} alt="background" className="fixed inset-0 w-full h-full object-cover opacity-40 z-0" />
      
      <div className="relative z-10 p-8 pt-20">
        <h1 className="text-4xl text-center mb-12 uppercase font-bold">S.H._DATABASE_PERSONNEL</h1>

        <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto mb-20">
          {characters.map((char) => (
            <div key={char.id} className="bg-zinc-950/90 border border-zinc-800 p-6 flex gap-6">
              <div className="w-48 h-48 bg-zinc-900 border border-zinc-800">
                {char.imageurl && <img src={char.imageurl} className="w-full h-full object-cover grayscale" />}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl text-red-800 font-bold">{char.name}</h2>
                <p className="text-zinc-500 text-xs uppercase">STATUS: {char.status}</p>
                <p className="text-zinc-200 mt-4 italic">{char.description}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="max-w-4xl mx-auto bg-zinc-950/95 border-2 border-zinc-900 p-10 shadow-2xl">
          <h2 className="text-center border-b border-zinc-900 pb-6 uppercase mb-8 font-bold">:: New_Archive_Entry ::</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input value={name} onChange={(e) => setName(e.target.value)} className="bg-black border border-zinc-800 p-4" placeholder="NAME" required />
            <input value={status} onChange={(e) => setStatus(e.target.value)} className="bg-black border border-zinc-800 p-4" placeholder="STATUS" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="bg-black border border-zinc-800 p-4" placeholder="DESCRIPTION" required></textarea>
            <button type="submit" className="border border-zinc-800 p-5 hover:bg-white hover:text-black uppercase font-bold">Archive_Data_Entry</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Characters;