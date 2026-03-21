import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import monstersBg from "../assets/silenthillhellmosnter.gif";

const Monsters = () => {
  const [monsters, setMonsters] = useState([]);
  const [showList, setShowList] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [danger, setDanger] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const API_URL = 'https://silent-hill-archives.onrender.com/api/monsters';

  const fetchMonsters = async () => {
    try {
      const res = await axios.get(API_URL);
      setMonsters(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setMonsters([]); }
  };

  useEffect(() => { fetchMonsters(); }, []);

  const openAddModal = () => {
    setEditId(null);
    setName(''); setDanger(''); setImage(''); setDescription('');
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (mon) => {
    setEditId(mon.monster_id);
    setName(mon.name);
    setDanger(mon.danger);
    setImage(mon.image);
    setDescription(mon.description);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${editId}`, { name, danger, image, description });
      } else {
        await axios.post(API_URL, { name, danger, image, description });
      }
      setIsModalOpen(false);
      fetchMonsters();
    } catch (err) { alert("error en la operacion"); }
  };

  const handleDelete = async (id, mName) => {
    if (window.confirm(`¿eliminar permanentemente a ${mName}?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchMonsters();
      } catch (err) { alert("error al borrar"); }
    }
  };

  const inputStyle = "bg-white border-2 border-zinc-300 w-full p-3 text-black outline-none uppercase text-sm font-bold";

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono">
      <img src={monstersBg} className="fixed inset-0 w-full h-full object-cover z-0 opacity-60" alt="bg" />
      
      <div className="fixed top-0 left-0 w-full bg-black/80 z-[100] border-b border-red-900 px-6 py-3 flex justify-between items-center backdrop-blur-md">
        <nav className="flex gap-6">
          <Link to="/characters" className="text-white/70 hover:text-white uppercase text-sm"> [ characters ] </Link>
          <Link to="/monsters" className="text-white font-bold uppercase text-sm border-b-2 border-white"> [ monsters ] </Link>
        </nav>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }} className="text-[10px] uppercase"> :: logout :: </button>
      </div>

      <div className="relative z-10 p-8 pt-24 flex flex-col items-center">
        <h1 className="text-3xl tracking-[0.4em] mb-12 uppercase font-bold text-red-600">s.h._database_threats</h1>
        
        <div className="flex gap-4 mb-10 z-20">
          <button onClick={openAddModal} className="px-5 py-2 border-2 bg-white text-black border-white uppercase text-xs font-bold hover:bg-red-700 hover:text-white hover:border-red-700 transition-all"> 
            [ add_new_threat ] 
          </button>
          <button onClick={() => setShowList(!showList)} className={`px-5 py-2 border-2 uppercase text-xs font-bold transition-all ${showList ? 'bg-red-700 border-red-700 text-white' : 'bg-white text-black border-white'}`}> 
            {showList ? '[ hide_monsters ]' : '[ view_monsters ]'}
          </button>
        </div>

        {showList && (
          <div className="w-full max-w-7xl bg-black/60 backdrop-blur-sm border border-red-900/30">
            <div className="grid grid-cols-[100px_1fr_2fr_120px] gap-4 p-4 border-b border-red-900/50 bg-red-950/20 uppercase text-xs font-bold text-red-300">
              <div>image</div><div>threat_spec</div><div>analysis</div><div className="text-center">actions</div>
            </div>
            {monsters.map((mon) => (
              <div key={mon.monster_id} className="grid grid-cols-[100px_1fr_2fr_120px] gap-4 p-4 items-center border-b border-red-950/20">
                <div className="w-20 h-20 border border-red-900 overflow-hidden"><img src={mon.image} className="w-full h-full object-cover" /></div>
                <div className="text-left font-bold uppercase text-red-600">{mon.name}<br/><span className="text-[10px] text-zinc-500">danger: {mon.danger}</span></div>
                <div className="text-sm text-zinc-300 text-left line-clamp-3">{mon.description}</div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => openEditModal(mon)} className="border border-white/50 text-[10px] uppercase p-1">edit</button>
                  <button onClick={() => handleDelete(mon.monster_id, mon.name)} className="border border-red-600 text-red-500 text-[10px] uppercase p-1">delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4">
            <div className="bg-white p-8 w-full max-w-lg border-4 border-red-900 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-4 text-black font-bold">X</button>
              <h2 className="text-black font-bold uppercase mb-4 text-center border-b border-black">
                {isEditing ? 'edit_threat_data' : 'add_new_threat_data'}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="designation" required />
                <input value={danger} onChange={(e) => setDanger(e.target.value)} className={inputStyle} placeholder="danger_level" required />
                <input value={image} onChange={(e) => setImage(e.target.value)} className={inputStyle} placeholder="image_url" required />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className={inputStyle} placeholder="analysis" required></textarea>
                <button type="submit" className="bg-red-900 text-white p-3 font-bold uppercase">
                  {isEditing ? 'update_database' : 'log_threat_to_archives'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Monsters;