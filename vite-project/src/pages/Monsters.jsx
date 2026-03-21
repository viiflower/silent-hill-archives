import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import monstersBg from "../assets/silenthillhellmosnter.gif";

const Monsters = () => {
  const [monsters, setMonsters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  
  const [name, setName] = useState('');
  const [dangerlevel, setDangerlevel] = useState('');
  const [imageurl, setImageurl] = useState('');
  const [description, setDescription] = useState('');

  const API_URL = 'https://silent-hill-archives.onrender.com/api/monsters';

  const fetchMonsters = async () => {
    try {
      const res = await axios.get(API_URL);
      setMonsters(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMonsters([]);
    }
  };

  useEffect(() => { fetchMonsters(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        name: name.toUpperCase(),
        dangerlevel: dangerlevel.toUpperCase(), // Asegúrate que en tu DB sea dangerlevel o danger_level
        imageurl: imageurl,
        description: description
      });
      setName(''); setDangerlevel(''); setImageurl(''); setDescription('');
      setShowForm(false);
      fetchMonsters();
    } catch (err) {
      alert("SERVER_ERROR_500: Revisa los logs de monstruos en Render.");
    }
  };

  const inputStyle = "bg-white border-2 border-zinc-300 w-full p-3 text-black focus:border-red-600 outline-none uppercase text-sm font-bold placeholder:text-zinc-500";

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono">
      <img src={monstersBg} className="fixed inset-0 w-full h-full object-cover opacity-60 z-0 grayscale brightness-50" />
      
      <div className="fixed top-0 left-0 w-full bg-black/60 z-[100] border-b border-zinc-900 px-6 py-3 flex justify-between items-center backdrop-blur-md">
        <nav className="flex gap-6">
          <Link to="/characters" className="text-white/70 hover:text-white transition-colors uppercase tracking-widest text-sm p-1 border-b-2 border-transparent"> [ Characters ] </Link>
          <Link to="/monsters" className="text-white font-bold uppercase tracking-widest text-sm p-1 border-b-2 border-white"> [ Monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] text-white hover:text-red-600 uppercase tracking-[0.2em]"> :: Logout :: </button>
      </div>

      <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.4em] mb-12 uppercase font-bold text-red-100">S.H._DATABASE_THREATS</h1>

        <div className="flex gap-4 mb-10 z-20">
          <button onClick={() => { setShowForm(!showForm); setShowList(false); }} className={`px-5 py-2 border-2 uppercase text-xs font-bold transition-all ${showForm ? 'bg-red-700 text-white border-red-700' : 'bg-white text-black border-white'}`}>
            {showForm ? '[ Cancel_Log ]' : '[ Add_New_Monster ]'}
          </button>
          <button onClick={() => { setShowList(!showList); setShowForm(false); }} className={`px-5 py-2 border-2 uppercase text-xs font-bold transition-all ${showList ? 'bg-red-700 text-white border-red-700' : 'bg-white text-black border-white'}`}>
            {showList ? '[ Hide_Threats ]' : '[ View_Threats ]'}
          </button>
        </div>

        {showForm && (
          <section className="w-full max-w-xl bg-white p-8 shadow-2xl mb-12 border-4 border-red-950 animation-fade-in">
            <h2 className="text-red-700 text-center border-b-2 border-zinc-200 pb-4 uppercase mb-8 font-bold tracking-widest">:: New_Threat_Log ::</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="DESIGNATION" required />
              <input value={dangerlevel} onChange={(e) => setDangerlevel(e.target.value)} className={inputStyle} placeholder="DANGER_LEVEL" required />
              <input value={imageurl} onChange={(e) => setImageurl(e.target.value)} className={inputStyle} placeholder="PASTE_IMAGE_URL" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className={`${inputStyle} resize-none`} placeholder="ANALYSIS_REPORT" required></textarea>
              <button type="submit" className="bg-red-950 text-white p-4 hover:bg-red-700 transition-all uppercase font-bold tracking-widest">Log_Threat_Data</button>
            </form>
          </section>
        )}

        {showList && (
          <div className="w-full max-w-5xl mx-auto mb-20 animation-fade-in">
            {monsters.length === 0 ? (
              <p className="text-center text-red-900 uppercase text-xs tracking-[0.3em] py-20 bg-black/40 border border-dashed border-red-900">-- NO_THREATS_REGISTERED --</p>
            ) : (
              monsters.map((mon) => (
                <div key={mon.id} className="bg-black/80 border border-red-950/50 p-5 flex gap-5 mb-4 backdrop-blur-sm">
                  <div className="w-32 h-32 bg-zinc-900 border border-red-950 flex-shrink-0 overflow-hidden">
                    {mon.imageurl ? (
                      <img src={mon.imageurl} alt={mon.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-red-950 font-bold">NO_IMG</div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-xl uppercase font-bold text-red-600">{mon.name}</h2>
                    <p className="text-red-900 text-xs uppercase font-bold">DANGER_LEVEL: {mon.dangerlevel}</p>
                    <p className="text-zinc-200 text-sm italic mt-2 border-l-2 border-red-900 pl-4">{mon.description}</p>
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

export default Monsters;