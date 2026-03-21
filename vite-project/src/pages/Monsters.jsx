import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import monstersBg from "../assets/silenthillhellmosnter.gif";

const Monsters = () => {
  const [monsters, setMonsters] = useState([]);
  const [name, setName] = useState('');
  const [danger, setDanger] = useState('');
  const [description, setDescription] = useState('');

  const fetchMonsters = async () => {
    try {
      const res = await axios.get('https://silent-hill-archives.onrender.com/api/monsters');
      setMonsters(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMonsters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://silent-hill-archives.onrender.com/api/monsters', {
        name: name.toUpperCase(),
        dangerLevel: danger.toUpperCase(), // Asegúrate que coincida con tu backend
        description
      });
      setName(''); setDanger(''); setDescription('');
      fetchMonsters();
    } catch (err) {
      alert("ERROR_IN_THREAT_REGISTRATION");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-x-hidden">
      {/* MENU DE NAVEGACION */}
      <div className="fixed top-0 left-0 w-full bg-black/60 z-[100] p-4 flex justify-between border-b border-zinc-900 backdrop-blur-sm">
        <div className="flex gap-6">
          <Link to="/characters" className="hover:text-red-700"> [ CHARACTERS ] </Link>
          <Link to="/monsters" className="text-red-700"> [ MONSTERS ] </Link>
        </div>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-zinc-500 hover:text-white"> LOGOUT </button>
      </div>

      <img src={monstersBg} alt="background" className="fixed inset-0 w-full h-full object-cover opacity-40 z-0 grayscale" />
      
      <div className="relative z-10 p-8 pt-20">
        <h1 className="text-4xl text-center mb-12 uppercase font-bold text-red-100">S.H._DATABASE_THREATS</h1>

        <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto mb-20">
          {monsters.map((mon) => (
            <div key={mon.id} className="bg-zinc-950/95 border border-red-950 p-6 flex gap-6">
              <div className="w-48 h-48 bg-zinc-900 border border-red-950">
                {mon.imageurl && <img src={mon.imageurl} className="w-full h-full object-cover grayscale contrast-125" />}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl text-red-700 font-bold">{mon.name}</h2>
                <p className="text-red-900 text-xs font-bold uppercase">DANGER_LEVEL: {mon.dangerlevel}</p>
                <p className="text-zinc-200 mt-4 italic">{mon.description}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="max-w-4xl mx-auto bg-zinc-950/95 border-2 border-red-950 p-10 shadow-2xl">
          <h2 className="text-red-700 text-center border-b border-red-950 pb-6 uppercase mb-8 font-bold">:: New_Threat_Log ::</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input value={name} onChange={(e) => setName(e.target.value)} className="bg-black border border-zinc-900 p-4" placeholder="ENTITY_NAME" required />
            <input value={danger} onChange={(e) => setDanger(e.target.value)} className="bg-black border border-zinc-900 p-4" placeholder="DANGER_LEVEL" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="bg-black border border-zinc-900 p-4" placeholder="NOTES" required></textarea>
            <button type="submit" className="border border-red-950 p-5 text-red-900 hover:bg-red-900 hover:text-white uppercase font-bold">Log_Threat_Data</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Monsters;