import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import monstersBg from "../assets/silenthillhellmosnter.gif";

const Monsters = () => {
  const [monsters, setMonsters] = useState([]);
  const [name, setName] = useState('');
  const [danger, setDanger] = useState('');
  const [description, setDescription] = useState('');

  const API_URL = 'https://silent-hill-archives.onrender.com/api/monsters';

  const fetchMonsters = async () => {
    try {
      const res = await axios.get(API_URL);
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
      await axios.post(API_URL, {
        name: name.toUpperCase(),
        dangerLevel: danger.toUpperCase(),
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
      <div className="fixed top-0 left-0 w-full bg-black/80 z-[100] border-b border-zinc-800 px-6 py-4 flex justify-between items-center backdrop-blur-md">
        <nav className="flex gap-6">
          <Link to="/characters" className="text-xs hover:text-red-700 transition-colors uppercase tracking-widest"> [ Characters ] </Link>
          <Link to="/monsters" className="text-red-700 font-bold uppercase tracking-widest"> [ Monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] text-zinc-500 hover:text-red-600 uppercase tracking-[0.2em]"> :: Logout :: </button>
      </div>

      <img src={monstersBg} alt="background" className="fixed inset-0 w-full h-full object-cover opacity-50 z-0 pointer-events-none grayscale brightness-50" />
      
      <div className="relative z-10 p-8 pt-24">
        <h1 className="text-4xl tracking-[0.5em] text-center mb-12 uppercase border-b border-red-950 pb-4 font-bold text-red-100">S.H._DATABASE_THREATS</h1>

        <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto mb-20">
          {monsters.map((mon) => (
            <div key={mon.id} className="bg-zinc-950/95 border border-red-950 p-6 flex flex-col md:flex-row gap-6 shadow-2xl backdrop-blur-sm">
              <div className="w-full md:w-48 h-48 bg-zinc-900 border border-zinc-800 overflow-hidden text-center">
                {mon.imageurl && <img src={mon.imageurl} alt={mon.name} className="w-full h-full object-cover grayscale brightness-50 contrast-150" />}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl tracking-widest uppercase mb-2 text-red-700 font-bold">{mon.name}</h2>
                <p className="text-red-900 text-xs mb-4 font-bold uppercase">DANGER_LEVEL: {mon.dangerlevel}</p>
                <p className="text-zinc-200 leading-relaxed text-sm italic">{mon.description}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="relative z-[60] max-w-4xl mx-auto bg-zinc-950/95 border-2 border-red-950 p-10 shadow-2xl mb-20">
          <h2 className="text-red-700 text-2xl tracking-[0.4em] text-center border-b border-red-950 pb-6 uppercase mb-8 font-bold">:: New_Threat_Log ::</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input value={name} onChange={(e) => setName(e.target.value)} className="bg-black border border-zinc-900 p-4 text-white focus:border-red-700 outline-none uppercase" placeholder="DESIGNATION" required />
              <input value={danger} onChange={(e) => setDanger(e.target.value)} className="bg-black border border-zinc-900 p-4 text-white focus:border-red-700 outline-none uppercase" placeholder="LEVEL" required />
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="5" className="bg-black border border-zinc-900 p-4 text-white focus:border-red-700 outline-none resize-none" placeholder="ANALYSIS_REPORT" required></textarea>
            <button type="submit" className="border border-red-950 p-5 text-red-900 hover:bg-red-900 hover:text-white transition-all uppercase font-bold tracking-[0.3em]">Log_Threat_Data</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Monsters;