import { useState, useEffect } from "react";
import monstersBg from "../assets/silenthillhellmosnter.gif"; 

export default function Monsters() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monsters, setMonsters] = useState([]); 
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", status: "", description: "", image: "" });

  const inputStyle = "w-full bg-transparent border-b border-black/30 p-3 text-black outline-none focus:border-black transition-all uppercase text-[12px] tracking-widest font-mono placeholder:text-gray-400";

  const fetchMonsters = async () => {
    try {
      const res = await fetch("https://silent-hill-archives.onrender.com/api/monsters"); 
      const data = await res.json();
      setMonsters(data);
    } catch (error) {
      console.error("Error fetching monsters:", error);
    }
  };

  useEffect(() => { fetchMonsters(); }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", status: "", description: "", image: "" });
  };

  const handleOpenAdd = () => {
    setEditingId(null); 
    setFormData({ name: "", status: "", description: "", image: "" });
    setIsModalOpen(true);
  };

  const startEdit = (m) => {
    setEditingId(m.monster_id); 
    setFormData({ 
      name: m.name || "", 
      status: m.status || "", 
      description: m.description || "", 
      image: m.image || "" 
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `https://silent-hill-archives.onrender.com/api/monsters/${editingId}` 
      : "https://silent-hill-archives.onrender.com/api/monsters";
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        closeModal();
        fetchMonsters();
      }
    } catch (error) {
      console.error("Error saving monster:", error);
    }
  };

  const deleteMonster = async (id) => {
    if (confirm("_CONFIRM_THREAT_ELIMINATION?")) {
      await fetch(`https://silent-hill-archives.onrender.com/api/monsters/${id}`, { method: "DELETE" });
      fetchMonsters();
    }
  };

  return (
    <div className="relative min-h-screen w-full font-['Special_Elite']">
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <img src={monstersBg} className="w-full h-full object-cover" alt="bg" />
        <div className="absolute inset-0 bg-red-950/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 p-12 max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-16 border-b-2 border-red-900/40 pb-10">
          <h1 className="text-5xl text-white tracking-[0.7em] uppercase font-bold text-red-700/80">Bestiary_Report</h1>
          <button 
            onClick={handleOpenAdd} 
            className="border-2 border-red-700 px-10 py-4 text-red-500 hover:bg-red-700 hover:text-white transition-all uppercase tracking-widest font-bold bg-black/40"
          >
            + REGISTER_THREAT
          </button>
        </header>

        <div className="bg-black/90 border border-red-900/20 shadow-2xl overflow-hidden backdrop-blur-md">
          <table className="w-full text-left text-[14px] uppercase tracking-widest text-white table-fixed">
            <thead className="bg-red-950/20 border-b border-red-900/40 text-red-400">
              <tr>
                <th className="p-4 w-20">ENTITY</th>
                <th className="p-4 w-52">ID_NAME</th>
                <th className="p-4 w-40">THREAT_LVL</th>
                <th className="p-4">OBSERVATIONS</th>
                <th className="p-4 w-48 text-right">PROTOCOL</th>
              </tr>
            </thead>
            <tbody>
              {monsters.map((m) => (
                <tr key={m.monster_id} className="border-b border-red-900/10 hover:bg-red-950/10 transition-all align-top">
                  <td className="p-4 pt-5">
                    <div className="w-10 h-10 border border-red-900/30 bg-black overflow-hidden shadow-inner shadow-red-900/20">
                      {m.image && <img src={m.image} className="w-full h-full object-cover grayscale sepia" alt="entity" />}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-red-100 pt-5 text-[13px]">{m.name}</td>
                  <td className="p-4 pt-5 text-red-500/70 text-[12px]">{m.status}</td>
                  <td className="p-4 pt-5 text-gray-400 italic text-[13px]">
                    <div className="whitespace-normal break-words pr-4 text-justify">{m.description}</div>
                  </td>
                  <td className="p-4 pt-5 text-right">
                    <div className="flex flex-col gap-3 items-end">
                      <button 
                        onClick={() => startEdit(m)} 
                        className="border-2 border-white/20 px-6 py-3 text-[11px] font-bold hover:bg-white hover:text-black transition-all w-44 text-center text-white/60"
                      >
                        [ MODIFY_DATA ]
                      </button>
                      <button 
                        onClick={() => deleteMonster(m.monster_id)} 
                        className="border-2 border-red-900/60 text-red-600 px-6 py-3 text-[11px] font-bold hover:bg-red-900 hover:text-white transition-all w-44 text-center"
                      >
                        [ PURGE_ENTITY ]
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md">
            <div className="w-full max-w-lg bg-white p-10 border-4 border-red-900 shadow-[0_0_50px_rgba(153,27,27,0.4)]">
              <h2 className="text-black tracking-[0.4em] uppercase text-xl mb-8 font-bold text-center border-b-2 border-red-900 pb-4">
                {editingId ? ":: MODIFY_THREAT_ENTRY ::" : ":: NEW_THREAT_DETECTED ::"}
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <input required className={inputStyle} placeholder="ENTITY_NAME" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required className={inputStyle} placeholder="THREAT_LEVEL" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} />
                <input className={inputStyle} placeholder="ASSET_URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                <textarea required className={`${inputStyle} h-32 resize-none normal-case`} placeholder="BEHAVIOR_DESCRIPTION" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <button type="submit" className="w-full bg-red-900 text-white py-5 font-bold tracking-[0.6em] uppercase hover:bg-red-700 transition-all border-2 border-red-950">
                  {editingId ? "[ UPDATE_INTEL ]" : "[ LOG_THREAT ]"}
                </button>
              </form>
              <button onClick={closeModal} className="mt-6 w-full text-[10px] text-gray-500 uppercase text-center font-bold tracking-widest hover:text-red-700 transition-colors">_CANCEL_LOG_</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}