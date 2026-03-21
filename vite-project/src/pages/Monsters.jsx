import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import monstersBg from "../assets/silenthillhellmosnter.gif";

const Monsters = () => {
  const [monsters, setMonsters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true); // Empezamos viendo la lista
  const [name, setName] = useState('');
  const [danger, setDanger] = useState('');
  const [image, setImage] = useState('');
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
        danger: danger.toUpperCase(),
        description: description,
        image: image,
        encounter_location: "SECTOR_DESCONOCIDO" // Campo obligatorio
      });
      setName(''); setDanger(''); setImage(''); setDescription('');
      setShowForm(false);
      setShowList(true);
      fetchMonsters();
    } catch (err) {
      alert("Error al registrar amenaza");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿PROCEDER CON LA ELIMINACIÓN DE DATOS DE LA AMENAZA: ${name.toUpperCase()}?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchMonsters();
      } catch (err) {
        alert("ERROR CRÍTICO AL ELIMINAR REGISTRO");
      }
    }
  };

  const inputStyle = "bg-white border-2 border-zinc-300 w-full p-3 text-black outline-none uppercase text-sm font-bold placeholder:text-zinc-500";

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono">
      <img src={monstersBg} className="fixed inset-0 w-full h-full object-cover z-0 opacity-70" alt="background" />
      
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full bg-black/80 z-[100] border-b border-red-900 px-6 py-3 flex justify-between items-center backdrop-blur-md">
        <nav className="flex gap-6">
          <Link to="/characters" className="text-white/70 hover:text-white transition-colors uppercase tracking-widest text-sm p-1 border-b-2 border-transparent"> [ characters ] </Link>
          <Link to="/monsters" className="text-white font-bold uppercase tracking-widest text-sm p-1 border-b-2 border-white"> [ monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] text-white hover:text-red-600 uppercase tracking-[0.2em]"> :: logout :: </button>
      </div>

      <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.4em] mb-12 uppercase font-bold text-red-600 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">s.h._database_threats</h1>
        
        {/* BOTONES SELECCIÓN BLANCOS */}
        <div className="flex gap-4 mb-10 z-20">
          <button 
            onClick={() => { setShowForm(!showForm); setShowList(false); }} 
            className={`px-5 py-2 border-2 uppercase text-xs font-bold transition-all ${showForm ? 'bg-red-700 text-white border-red-700' : 'bg-white text-black border-white'}`}
          > 
            [ add_new_monster ] 
          </button>
          <button 
            onClick={() => { setShowList(!showList); setShowForm(false); }} 
            className={`px-5 py-2 border-2 uppercase text-xs font-bold transition-all ${showList ? 'bg-red-700 text-white border-red-700' : 'bg-white text-black border-white'}`}
          > 
            [ view_threats ] 
          </button>
        </div>

        {/* FORMULARIO */}
        {showForm && (
          <section className="w-full max-w-xl bg-white p-8 mb-12 border-4 border-red-900 shadow-[0_0_30px_rgba(153,0,0,0.4)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="designation" required />
              <input value={danger} onChange={(e) => setDanger(e.target.value)} className={inputStyle} placeholder="danger_level" required />
              <input value={image} onChange={(e) => setImage(e.target.value)} className={inputStyle} placeholder="image_url" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className={inputStyle} placeholder="analysis_report" required></textarea>
              <button type="submit" className="bg-red-950 text-white p-4 font-bold uppercase hover:bg-red-900 transition-colors">log_threat_data</button>
            </form>
          </section>
        )}

        {/* LISTA ESTILO TABLA */}
        {showList && (
          <div className="w-full max-w-7xl mx-auto mb-20 bg-black/60 backdrop-blur-md border border-red-900/30">
            {monsters.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-red-900">
                <p className="text-red-700 uppercase tracking-widest animate-pulse">-- warning: no_threats_detected_in_perimeter --</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* CABECERA TABLA */}
                <div className="grid grid-cols-[100px_1fr_2fr_120px] gap-4 p-4 border-b border-red-900/50 bg-red-950/20 uppercase text-xs font-bold text-red-300">
                  <div>image</div>
                  <div>threat_spec</div>
                  <div>analysis</div>
                  <div className="text-center">actions</div>
                </div>

                {/* FILAS TABLA */}
                {monsters.map((mon) => (
                  <div key={mon.monster_id} className="grid grid-cols-[100px_1fr_2fr_120px] gap-4 p-4 items-center border-b border-red-950/20 hover:bg-red-950/10 transition-all">
                    {/* COLUMNA IMAGEN CONTROLADA */}
                    <div className="w-20 h-20 flex-shrink-0 border border-red-900 overflow-hidden bg-zinc-900">
                      <img src={mon.image} className="w-full h-full object-cover" alt={mon.name} />
                    </div>
                    
                    {/* COLUMNA DATOS */}
                    <div className="text-left">
                      <h2 className="text-lg uppercase font-bold text-red-600 leading-tight">{mon.name}</h2>
                      <p className="text-[10px] text-zinc-500 uppercase mt-1">danger: {mon.danger}</p>
                    </div>

                    {/* COLUMNA DESCRIPCIÓN */}
                    <div className="text-sm text-zinc-300 pr-4 leading-relaxed text-left line-clamp-3">
                      {mon.description}
                    </div>

                    {/* COLUMNA ACCIONES FUNCIONALES */}
                    <div className="flex flex-col gap-2 items-center">
                      <button className="w-full px-3 py-1 border border-white/50 text-[10px] uppercase hover:bg-white hover:text-black transition-all">edit</button>
                      <button 
                        onClick={() => handleDelete(mon.monster_id, mon.name)}
                        className="w-full px-3 py-1 border border-red-600 text-[10px] text-red-500 uppercase hover:bg-red-600 hover:text-white transition-all"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Monsters;