import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import charactersBg from "../assets/silenthill3login.gif";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  // estados para editar
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  // campos del formulario
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
      await axios.post(API_URL, { name, status, description, image });
      resetForm();
      fetchCharacters();
    } catch (err) { alert("error al guardar"); }
  };

  const handleDelete = async (id, charName) => {
    if (window.confirm(`¿borrar registro de ${charName}?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCharacters();
      } catch (err) { alert("error al borrar"); }
    }
  };

  const openEdit = (char) => {
    setEditId(char.char_id);
    setName(char.name);
    setStatus(char.status);
    setImage(char.image);
    setDescription(char.description);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editId}`, { name, status, image, description });
      setIsEditing(false);
      resetForm();
      fetchCharacters();
    } catch (err) { alert("error al actualizar"); }
  };

  const resetForm = () => {
    setName(''); setStatus(''); setImage(''); setDescription('');
    setShowForm(false); setShowList(true);
  };

  const inputStyle = "bg-white border-2 border-zinc-300 w-full p-3 text-black outline-none uppercase text-sm font-bold";

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono">
      <img src={charactersBg} className="fixed inset-0 w-full h-full object-cover z-0 opacity-60" alt="bg" />
      
      {/* barra navegacion */}
      <div className="fixed top-0 left-0 w-full bg-black/80 z-[100] border-b border-zinc-900 px-6 py-3 flex justify-between items-center backdrop-blur-md">
        <nav className="flex gap-6">
          <Link to="/characters" className="text-white font-bold uppercase text-sm border-b-2 border-white"> [ characters ] </Link>
          <Link to="/monsters" className="text-white/70 hover:text-white uppercase text-sm"> [ monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] uppercase"> :: logout :: </button>
      </div>

      <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.4em] mb-12 uppercase font-bold text-center">s.h._database_personnel</h1>
        
        {/* botones seleccion blancos */}
        <div className="flex gap-4 mb-10 z-20">
          <button onClick={() => { setShowForm(true); setShowList(false); }} className={`px-5 py-2 border-2 uppercase text-xs font-bold ${showForm ? 'bg-red-700 border-red-700' : 'bg-white text-black border-white'}`}> [ add_new ] </button>
          <button onClick={() => { setShowList(true); setShowForm(false); }} className={`px-5 py-2 border-2 uppercase text-xs font-bold ${showList && !isEditing ? 'bg-red-700 border-red-700' : 'bg-white text-black border-white'}`}> [ view_db ] </button>
        </div>

        {/* tabla de datos */}
        {showList && (
          <div className="w-full max-w-7xl bg-black/60 backdrop-blur-sm border border-white/20">
            <div className="grid grid-cols-[100px_1fr_2fr_120px] gap-4 p-4 border-b border-white/30 bg-zinc-900/50 uppercase text-xs font-bold">
              <div>image</div><div>identity</div><div>observations</div><div className="text-center">actions</div>
            </div>
            {characters.map((char) => (
              <div key={char.char_id} className="grid grid-cols-[100px_1fr_2fr_120px] gap-4 p-4 items-center border-b border-white/10">
                <div className="w-20 h-20 border border-zinc-700 overflow-hidden"><img src={char.image} className="w-full h-full object-cover" /></div>
                <div className="text-left font-bold uppercase">{char.name}<br/><span className="text-[10px] text-zinc-500">{char.status}</span></div>
                <div className="text-sm text-zinc-300 text-left line-clamp-3">{char.description}</div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => openEdit(char)} className="border border-white/50 text-[10px] uppercase p-1">edit</button>
                  <button onClick={() => handleDelete(char.char_id, char.name)} className="border border-red-900 text-red-500 text-[10px] uppercase p-1">delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* modal para editar */}
        {isEditing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4">
            <div className="bg-white p-8 w-full max-w-md border-4 border-black relative">
              <button onClick={() => setIsEditing(false)} className="absolute top-2 right-4 text-black font-bold">X</button>
              <h2 className="text-black font-bold uppercase mb-4 text-center border-b border-black">edit_entry</h2>
              <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="name" />
                <input value={status} onChange={(e) => setStatus(e.target.value)} className={inputStyle} placeholder="status" />
                <input value={image} onChange={(e) => setImage(e.target.value)} className={inputStyle} placeholder="image_url" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className={inputStyle}></textarea>
                <button type="submit" className="bg-black text-white p-3 font-bold uppercase">update</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Characters;