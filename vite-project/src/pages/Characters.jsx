import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import charactersBg from "../assets/silenthill3login.gif";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true); // Empezamos viendo la lista
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState('');
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
      await axios.post(API_URL, {
        name: name.toUpperCase(),
        status: status.toUpperCase(),
        description: description,
        image: image 
      });
      setName(''); setStatus(''); setImage(''); setDescription('');
      setShowForm(false);
      setShowList(true);
      fetchCharacters();
    } catch (err) {
      alert("Error al guardar personaje");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿ESTÁ SEGURO DE ELIMINAR EL ARCHIVO DE ${name.toUpperCase()}?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCharacters(); // Recargar lista
      } catch (err) {
        alert("ERROR AL ELIMINAR REGISTRO");
      }
    }
  };

  const inputStyle = "bg-white border-2 border-zinc-300 w-full p-3 text-black outline-none uppercase text-sm font-bold placeholder:text-zinc-500";

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono">
      <img src={charactersBg} className="fixed inset-0 w-full h-full object-cover z-0 opacity-60" alt="background" />
      
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full bg-black/80 z-[100] border-b border-zinc-900 px-6 py-3 flex justify-between items-center backdrop-blur-md">
        <nav className="flex gap-6">
          <Link to="/characters" className="text-white font-bold uppercase tracking-widest text-sm p-1 border-b-2 border-white"> [ characters ] </Link>
          <Link to="/monsters" className="text-white/70 hover:text-white transition-colors uppercase tracking-widest text-sm p-1 border-b-2 border-transparent"> [ monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] text-white hover:text-red-600 uppercase tracking-[0.2em]"> :: logout :: </button>
      </div>

      <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.4em] mb-12 uppercase font-bold text-center drop-shadow-lg">s.h._database_personnel</h1>
        
        {/* BOTONES SELECCIÓN BLANCOS */}
        <div className="flex gap-4 mb-10 z-20">
          <button 
            onClick={() => { setShowForm(!showForm); setShowList(false); }} 
            className={`px-5 py-2 border-2 uppercase text-xs font-bold transition-all ${showForm ? 'bg-red-700 text-white border-red-700' : 'bg-white text-black border-white'}`}
          > 
            [ add_new_entity ] 
          </button>
          <button 
            onClick={() => { setShowList(!showList); setShowForm(false); }} 
            className={`px-5 py-2 border-2 uppercase text-xs font-bold transition-all ${showList ? 'bg-red-700 text-white border-red-700' : 'bg-white text-black border-white'}`}
          > 
            [ view_database ] 
          </button>
        </div>

        {/* FORMULARIO */}
        {showForm && (
          <section className="w-full max-w-xl bg-white p-8 mb-12 border-4 border-zinc-900 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="name" required />
              <input value={status} onChange={(e) => setStatus(e.target.value)} className={inputStyle} placeholder="status" required />
              <input value={image} onChange={(e) => setImage(e.target.value)} className={inputStyle} placeholder="image_url" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className={inputStyle} placeholder="observations" required></textarea>
              <button type="submit" className="bg-black text-white p-4 font-bold uppercase hover:bg-zinc-800 transition-colors">archive_data_entry</button>
            </form>
          </section>
        )}

        {/* LISTA ESTILO TABLA */}
        {showList && (
          <div className="w-full max-w-7xl mx-auto mb-20 bg-black/60 backdrop-blur-sm border border-white/20">
            {characters.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-500">
                <p className="text-zinc-400 uppercase tracking-widest animate-pulse">-- no_entities_found_in_archives --</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* CABECERA TABLA */}
                <div className="grid grid-cols-[100px_1fr_2fr_120px] gap-4 p-4 border-b border-white/30 bg-zinc-900/50 uppercase text-xs font-bold text-zinc-400">
                  <div>image</div>
                  <div>identity</div>
                  <div>observations</div>
                  <div className="text-center">actions</div>
                </div>

                {/* FILAS TABLA */}
                {characters.map((char) => (
                  <div key={char.char_id} className="grid grid-cols-[100px_1fr_2fr_120px] gap-4 p-4 items-center border-b border-white/10 hover:bg-white/5 transition-all">
                    {/* COLUMNA IMAGEN CONTROLADA */}
                    <div className="w-20 h-20 flex-shrink-0 border border-zinc-700 overflow-hidden bg-zinc-900">
                      <img src={char.image} className="w-full h-full object-cover" alt={char.name} />
                    </div>
                    
                    {/* COLUMNA DATOS */}
                    <div className="text-left">
                      <h2 className="text-lg uppercase font-bold leading-tight">{char.name}</h2>
                      <p className="text-[10px] text-zinc-500 uppercase mt-1">status: {char.status}</p>
                    </div>

                    {/* COLUMNA DESCRIPCIÓN */}
                    <div className="text-sm text-zinc-300 pr-4 leading-relaxed text-left line-clamp-3">
                      {char.description}
                    </div>

                    {/* COLUMNA ACCIONES FUNCIONALES */}
                    <div className="flex flex-col gap-2 items-center">
                      <button className="w-full px-3 py-1 border border-white/50 text-[10px] uppercase hover:bg-white hover:text-black transition-all">edit</button>
                      <button 
                        onClick={() => handleDelete(char.char_id, char.name)}
                        className="w-full px-3 py-1 border border-red-900 text-[10px] text-red-500 uppercase hover:bg-red-900 hover:text-white transition-all"
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

export default Characters;