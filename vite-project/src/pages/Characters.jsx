import React, { useState, useEffect } from 'react';
import axios from 'axios';
import charactersBg from "../assets/silenthill3login.gif";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  const fetchCharacters = async () => {
    try {
      const res = await axios.get('https://tu-api-render.onrender.com/api/characters');
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
      await axios.post('https://tu-api-render.onrender.com/api/characters', {
        name: name.toUpperCase(),
        status: status.toUpperCase(),
        description
      });
      setName('');
      setStatus('');
      setDescription('');
      fetchCharacters();
    } catch (err) {
      alert("ERROR_IN_ARCHIVE_PROCESS");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-x-hidden">
      {/* FONDO DE SILENT HILL 3 GIF */}
      <img 
        src={charactersBg} 
        alt="background" 
        className="fixed inset-0 w-full h-full object-cover opacity-40 z-0 pointer-events-none" 
      />
      
      <div className="relative z-10 p-8">
        <h1 className="text-4xl tracking-[0.5em] text-center mb-12 uppercase border-b border-zinc-900 pb-4 font-bold shadow-black drop-shadow-md">
          S.H._DATABASE_PERSONNEL
        </h1>

        <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto mb-20">
          {characters.map((char) => (
            <div key={char.char_id} className="bg-zinc-950/90 border border-zinc-800 p-6 flex flex-col md:flex-row gap-6 shadow-2xl backdrop-blur-sm">
              <div className="w-full md:w-48 h-48 bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden">
                {char.image && <img src={char.image} alt={char.name} className="w-full h-full object-cover grayscale brightness-75 hover:brightness-100 transition-all" />}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl tracking-widest uppercase mb-2 text-red-800 font-bold">{char.name}</h2>
                <p className="text-zinc-500 text-xs mb-4 tracking-tighter">STATUS: {char.status}</p>
                <p className="text-zinc-200 leading-relaxed text-sm italic">{char.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CUADRO DE REGISTRO CENTRADO Y VISIBLE */}
        <section className="relative z-[60] max-w-4xl mx-auto bg-zinc-950/95 border-2 border-zinc-900 p-10 shadow-[0_0_50px_rgba(0,0,0,1)] mb-20">
          <h2 className="text-white text-2xl tracking-[0.4em] text-center border-b border-zinc-900 pb-6 uppercase mb-8 font-bold">
            :: New_Archive_Entry ::
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Subject_Name</label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="bg-black border border-zinc-800 p-4 text-white focus:border-red-900 outline-none uppercase placeholder:text-zinc-900 transition-colors" 
                  placeholder="SPECIFY_NAME" 
                  required 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Condition_Status</label>
                <input 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)} 
                  className="bg-black border border-zinc-800 p-4 text-white focus:border-red-900 outline-none uppercase placeholder:text-zinc-900 transition-colors" 
                  placeholder="CURRENT_STATUS" 
                  required 
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Description_Report</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows="5" 
                className="bg-black border border-zinc-800 p-4 text-white focus:border-red-900 outline-none resize-none placeholder:text-zinc-900 transition-colors" 
                placeholder="ENTER_DETAILED_OBSERVATIONS" 
                required 
              ></textarea>
            </div>
            <button type="submit" className="border border-zinc-800 p-5 text-zinc-500 hover:bg-white hover:text-black transition-all uppercase font-bold tracking-[0.3em]">
              Archive_Data_Entry
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Characters;