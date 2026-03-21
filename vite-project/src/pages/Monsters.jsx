import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Asegúrate de que esta ruta sea correcta para tu gif de monstruos
import monstersBg from "../assets/silenthillhellmosnter.gif";

const Monsters = () => {
  const [monsters, setMonsters] = useState([]);
  const [showForm, setShowForm] = useState(false); // Estado para ocultar/mostrar formulario
  const [showList, setShowList] = useState(false); // Estado para ocultar/mostrar lista
  
  // Estados para el formulario
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
      // Limpiar y ocultar formulario tras guardar
      setName(''); setDanger(''); setDescription('');
      setShowForm(false);
      fetchMonsters(); // Recargar lista
    } catch (err) {
      alert("ERROR_IN_THREAT_REGISTRATION");
    }
  };

  // Estilos comunes para inputs transparentes (con toque rojo sutil)
  const inputStyle = "bg-transparent border-b border-red-950 w-full p-2 text-white focus:border-red-600 outline-none transition-colors placeholder:text-red-950/70 uppercase text-sm";

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-x-hidden">
      {/* 1. GIF DE FONDO (Más visible, con filtro oscuro rojo) */}
      <img src={monstersBg} alt="background" className="fixed inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none grayscale brightness-50" />
      <div className="fixed inset-0 bg-red-950/10 z-1 pointer-events-none"></div>
      
      {/* 2. NAVEGACIÓN (Botones Blancos, igual que Characters) */}
      <div className="fixed top-0 left-0 w-full bg-black/50 z-[100] border-b border-zinc-900 px-6 py-3 flex justify-between items-center backdrop-blur-sm">
        <nav className="flex gap-6">
          <Link to="/characters" className="text-white/70 hover:text-white transition-colors uppercase tracking-widest text-sm p-1 border-b-2 border-transparent hover:border-white/50"> [ Characters ] </Link>
          <Link to="/monsters" className="text-white font-bold uppercase tracking-widest text-sm p-1 border-b-2 border-white"> [ Monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] text-zinc-400 hover:text-red-600 uppercase tracking-[0.2em] transition-colors"> :: Logout :: </button>
      </div>

      {/* 3. CONTENIDO PRINCIPAL (Transparente) */}
      <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.4em] text-center mb-12 uppercase text-red-100 font-bold opacity-80">S.H._DATABASE_THREATS</h1>

        {/* CONTROLES CRUD (Minimalistas) */}
        <div className="flex gap-4 mb-10 z-20">
          <button 
            onClick={() => { setShowForm(!showForm); setShowList(false); }}
            className={`px-5 py-2 border uppercase text-xs tracking-widest transition-all ${showForm ? 'bg-red-700 text-white border-red-700' : 'border-red-950 text-red-900 hover:border-red-600 hover:text-red-100'}`}
          >
            {showForm ? '[ Cancel_Log ]' : '[ Add_New_Monster ]'}
          </button>
          
          <button 
            onClick={() => { setShowList(!showList); setShowForm(false); }}
            className={`px-5 py-2 border uppercase text-xs tracking-widest transition-all ${showList ? 'bg-red-700 text-white border-red-700' : 'border-red-950 text-red-900 hover:border-red-600 hover:text-red-100'}`}
          >
            {showList ? '[ Hide_Threats ]' : '[ View_Threats ]'}
          </button>
        </div>

        {/* A. FORMULARIO TRANSPARENTE (Rojo oscuro, solo si showForm es true) */}
        {showForm && (
          <section className="relative z-[60] w-full max-w-xl bg-black/90 border border-red-950 p-8 shadow-2xl backdrop-blur-md mb-12 animation-fade-in">
            <h2 className="text-red-600 text-xl tracking-[0.3em] text-center border-b border-red-950 pb-4 uppercase mb-8 font-bold">:: New_Threat_Log ::</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="DESIGNATION" required />
                <input value={danger} onChange={(e) => setDanger(e.target.value)} className={inputStyle} placeholder="LEVEL" required />
              </div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className={`${inputStyle} resize-none`} placeholder="ANALYSIS_REPORT" required></textarea>
              <button type="submit" className="border border-red-950 p-3 text-red-900 hover:bg-red-700 hover:text-white hover:border-red-700 transition-all uppercase font-bold tracking-[0.2em] text-sm mt-4">Log_Threat_Data</button>
            </form>
          </section>
        )}

        {/* B. LISTA DE DATOS TRANSPARENTE (Solo visible si showList es true) */}
        {showList && (
          <div className="grid grid-cols-1 gap-6 w-full max-w-5xl mx-auto mb-20 animation-fade-in">
            {monsters.length === 0 ? (
              <p className="text-center text-red-950 uppercase text-xs tracking-widest py-10">-- NO_THREATS_REGISTERED --</p>
            ) : (
              monsters.map((mon) => (
                <div key={mon.id} className="bg-black/70 border border-red-950/50 p-5 flex flex-col md:flex-row gap-5 shadow-lg backdrop-blur-sm hover:border-red-800 transition-colors">
                  <div className="w-full md:w-32 h-32 bg-zinc-950 border border-red-950/30 overflow-hidden text-center flex items-center justify-center">
                    {mon.imageurl ? (
                      <img src={mon.imageurl} alt={mon.name} className="w-full h-full object-cover grayscale brightness-50 contrast-150" />
                    ) : (
                      <span className="text-red-950 text-xs">NO_IMG</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-xl tracking-widest uppercase text-red-700 font-bold">{mon.name}</h2>
                    <p className="text-red-900 text-xs mb-3 font-bold uppercase">DANGER_LEVEL: {mon.dangerlevel}</p>
                    <p className="text-zinc-200 leading-relaxed text-sm italic border-l-2 border-red-950/50 pl-4">{mon.description}</p>
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