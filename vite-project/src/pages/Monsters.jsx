import React, { useState, useEffect } from 'react';
import axios from 'axios';
import monstersBg from "../assets/silenthillhellmosnter.gif";

const Monsters = () => {
  const [monsters, setMonsters] = useState([]);
  const [name, setName] = useState('');
  const [danger, setDanger] = useState('');
  const [description, setDescription] = useState('');

  const fetchMonsters = async () => {
    try {
      // RECUERDA CAMBIAR ESTA URL POR LA REAL DE TU RENDER
      const res = await axios.get('https://tu-api-render.onrender.com/api/monsters');
      setMonsters(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCharacters(); // Error tipográfico corregido a fetchMonsters()
    fetchMonsters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://tu-api-render.onrender.com/api/monsters', {
        name: name.toUpperCase(),
        danger: danger.toUpperCase(),
        description
      });
      setName('');
      setDanger('');
      setDescription('');
      fetchMonsters();
    } catch (err) {
      alert("ERROR_IN_THREAT_REGISTRATION");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-x-hidden">
      {/* FONDO DE INFIERNO GIF FIJO */}
      <img 
        src={monstersBg} 
        alt="background" 
        className="fixed inset-0 w-full h-full object-cover opacity-50 z-0 pointer-events-none grayscale brightness-50 contrast-125" 
      />
      
      <div className="relative z-10 p-8">
        <h1 className="text-4xl tracking-[0.5em] text-center mb-12 uppercase border-b border-red-950 pb-4 font-bold shadow-black drop-shadow-lg">
          S.H._DATABASE_THREATS
        </h1>

        {/* LISTA DE MONSTRUOS CON CUADROS VISIBLES */}
        <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto mb-20">
          {monsters.map((mon) => (
            <div key={mon.monster_id} className="bg-zinc-950/95 border border-red-950 p-6 flex flex-col md:flex-row gap-6 shadow-2xl backdrop-blur-sm">
              <div className="w-full md:w-48 h-48 bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden">
                {mon.image && <img src={mon.image} alt={mon.name} className="w-full h-full object-cover grayscale brightness-50 contrast-150 hover:grayscale-0 hover:brightness-100 transition-all" />}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl tracking-widest uppercase mb-2 text-red-700 font-bold">{mon.name}</h2>
                <p className="text-red-900 text-xs mb-4 font-bold tracking-widest uppercase">DANGER_LEVEL: {mon.danger}</p>
                <p className="text-zinc-200 leading-relaxed text-sm italic">{mon.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CUADRO DE REGISTRO DE MONSTRUOS (CENTRADO Y OSCURO) */}
        <section className="relative z-[60] max-w-4xl mx-auto bg-zinc-950/95 border-2 border-red-950 p-10 shadow-[0_0_60px_rgba(127,29,29,0.5)] mb-20">
          <h2 className="text-red-700 text-2xl tracking-[0.4em] text-center border-b border-red-950 pb-6 uppercase mb-8 font-bold">
            :: New_Threat_Log ::
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left relative z-[70]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Entity_Designation</label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="bg-black border border-zinc-900 p-4 text-white focus:border-red-700 outline-none uppercase placeholder:text-zinc-900 transition-all relative z-[70]" 
                  placeholder="DESIGNATION" 
                  required 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Threat_Level</label>
                <input 
                  value={danger} 
                  onChange={(e) => setDanger(e.target.value)} 
                  className="bg-black border border-zinc-900 p-4 text-white focus:border-red-700 outline-none uppercase placeholder:text-zinc-900 transition-all relative z-[70]" 
                  placeholder="LEVEL" 
                  required 
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 relative z-[70]">
              <label className="text-zinc-600 text-[10px] uppercase tracking-widest">Behavioral_Notes</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows="5" 
                className="bg-black border border-zinc-900 p-4 text-white focus:border-red-700 outline-none resize-none placeholder:text-zinc-900 transition-all relative z-[70]" 
                placeholder="ANALYSIS_REPORT" 
                required 
              ></textarea>
            </div>
            <button type="submit" className="border border-red-950 p-5 text-red-900 hover:bg-red-900 hover:text-white transition-all uppercase font-bold tracking-[0.3em] relative z-[70]">
              Log_Threat_Data
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Monsters;