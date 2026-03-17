// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // Estilo base para los botones
  const bigBtnStyle = "border-2 border-white px-10 py-4 text-[13px] font-bold tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] no-underline flex items-center justify-center";

  // Objeto de estilo para forzar el blanco siempre
  const whiteTextStyle = { color: '#ffffff', textDecoration: 'none' };

  return (
    <nav className="w-full bg-black/95 border-b border-white/10 p-8 font-['Special_Elite'] sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-red-600 animate-pulse"></div>
          <span className="text-white tracking-[0.5em] text-sm font-bold uppercase">S.H._DATABASE_V.4</span>
        </div>

        {/* BOTONES CON ESTILO FORZADO POR REACT */}
        <div className="flex gap-10">
          <Link to="/characters" className={bigBtnStyle} style={whiteTextStyle}>
            [ CHARACTERS ]
          </Link>
          <Link to="/monsters" className={bigBtnStyle} style={whiteTextStyle}>
            [ MONSTERS ]
          </Link>
        </div>

        <button 
          onClick={() => navigate("/")}
          className="text-white opacity-40 text-[10px] tracking-[0.3em] uppercase border border-white/20 px-4 py-2 hover:bg-white/10 transition-all"
        >
          _LOGOUT
        </button>
      </div>
    </nav>
  );
}