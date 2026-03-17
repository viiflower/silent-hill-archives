import { useState, useEffect } from "react";
import charactersBg from "../assets/silenthillhellmosnter.gif"; 

export default function Characters() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [characters, setCharacters] = useState([]); 
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", status: "", description: "", image: "" });

  const inputStyle = "w-full bg-transparent border-b border-black/30 p-3 text-black outline-none focus:border-black transition-all uppercase text-[12px] tracking-widest font-mono placeholder:text-gray-400";

  const fetchCharacters = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/characters");
      const data = await res.json();
      setCharacters(data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => { fetchCharacters(); }, []);

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

  const startEdit = (c) => {
    setEditingId(c.char_id);
    setFormData({ 
      name: c.name || "", 
      status: c.status || "", 
      description: c.description || "", 
      image: c.image || "" 
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `http://localhost:3000/api/characters/${editingId}` 
      : "http://localhost:3000/api/characters";
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        closeModal(); 
        fetchCharacters(); 
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const deleteChar = async (id) => {
    if (confirm("_CONFIRM_DATA_PURGE?")) {
      await fetch(`http://localhost:3000/api/characters/${id}`, { method: "DELETE" });
      fetchCharacters();
    }
  };

  return (
    <div className="relative min-h-screen w-full font-['Special_Elite']">
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <img src={charactersBg} className="w-full h-full object-cover" alt="bg" />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 p-12 max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-16 border-b-2 border-white/20 pb-10">
          <h1 className="text-5xl text-white tracking-[0.7em] uppercase font-bold">Archive_Personnel</h1>
          <button 
            onClick={handleOpenAdd} 
            className="border-2 border-white px-10 py-4 text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest font-bold"
          >
            + ADD_NEW_ENTRY
          </button>
        </header>

        <div className="bg-black/80 border border-white/20 shadow-2xl overflow-hidden backdrop-blur-sm">
          <table className="w-full text-left text-[14px] uppercase tracking-widest text-white table-fixed">
            <thead className="bg-white/10 border-b border-white/40 text-gray-300">
              <tr>
                <th className="p-4 w-20">VISUAL</th>
                <th className="p-4 w-52">NAME</th>
                <th className="p-4 w-40">STATUS</th>
                <th className="p-4">DESCRIPTION_REPORT</th>
                <th className="p-4 w-48 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {characters.map((c) => (
                <tr key={c.char_id} className="border-b border-white/10 hover:bg-white/5 transition-all align-top">
                  <td className="p-4 pt-5">
                    <div className="w-10 h-10 border border-white/20 bg-gray-900 overflow-hidden">
                      {c.image && <img src={c.image} className="w-full h-full object-cover grayscale" alt="subject" />}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white pt-5 text-[13px]">{c.name}</td>
                  <td className="p-4 pt-5 text-gray-400 text-[12px]">{c.status}</td>
                  <td className="p-4 pt-5 text-gray-400 italic text-[13px]">
                    <div className="whitespace-normal break-words pr-4 text-justify">{c.description}</div>
                  </td>
                  <td className="p-4 pt-5 text-right">
                    <div className="flex flex-col gap-3 items-end">
                      <button 
                        onClick={() => startEdit(c)} 
                        className="border-2 border-white/40 px-6 py-3 text-[11px] font-bold hover:bg-white hover:text-black transition-all w-44 text-center"
                      >
                        [ MODIFY_FILE ]
                      </button>
                      <button 
                        onClick={() => deleteChar(c.char_id)} 
                        className="border-2 border-red-900/60 text-red-600 px-6 py-3 text-[11px] font-bold hover:bg-red-900 hover:text-white transition-all w-44 text-center"
                      >
                        [ PURGE_DATA ]
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white p-10 border-4 border-black shadow-2xl">
              <h2 className="text-black tracking-[0.4em] uppercase text-xl mb-8 font-bold text-center border-b-2 border-black pb-4">
                {editingId ? ":: UPDATE_ARCHIVE ::" : ":: NEW_RECORD ::"}
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <input required className={inputStyle} placeholder="NAME" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required className={inputStyle} placeholder="STATUS" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} />
                <input className={inputStyle} placeholder="IMAGE URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                <textarea required className={`${inputStyle} h-32 resize-none normal-case`} placeholder="DESCRIPTION" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <button type="submit" className="w-full bg-black text-white py-5 font-bold tracking-[0.6em] uppercase hover:bg-gray-800 transition-all border-2 border-black">
                  {editingId ? "[ COMMIT_CHANGES ]" : "[ UPLOAD_ENTRY ]"}
                </button>
              </form>
              <button onClick={closeModal} className="mt-6 w-full text-[10px] text-gray-400 uppercase text-center font-bold tracking-widest hover:text-red-600 transition-colors">_ABORT_ACTION</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}