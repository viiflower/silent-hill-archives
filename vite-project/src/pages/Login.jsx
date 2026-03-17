import { useState } from "react"
import { useNavigate } from "react-router-dom"
import fog from "../assets/silenthill2fog.gif"

function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [regData, setRegData] = useState({ username: "", password: "" })

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: password })
      })
      if (res.ok) {
        navigate("/characters")
      } else {
        alert("ERROR: ACCESO DENEGADO.")
      }
    } catch (error) {
      alert("ERROR_SYSTEM_FAILURE")
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData)
      })
      if (res.ok) {
        alert("EXPEDIENTE CREADO CON ÉXITO")
        setIsRegisterOpen(false)
      } else {
        alert("ERROR AL REGISTRAR")
      }
    } catch (error) {
      alert("CONNECTION_LOST")
    }
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden font-['Special_Elite']">
      <img src={fog} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <h1 className="text-white text-4xl md:text-6xl tracking-[0.3em] mb-12 uppercase font-bold text-center">
          SILENT_HILL_ARCHIVES
        </h1>
        
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-6">
          <input 
            className="w-full bg-transparent border-b border-white/20 text-white p-2 outline-none uppercase text-xs tracking-widest"
            placeholder="IDENTITY" 
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input 
            type="password"
            className="w-full bg-transparent border-b border-white/20 text-white p-2 outline-none uppercase text-xs tracking-widest"
            placeholder="SECURITY_CODE" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full border border-white/40 text-white py-3 hover:bg-white/10 transition-all uppercase text-[10px] tracking-[0.5em]">
            [ ACCESS_SYSTEM ]
          </button>
          <button 
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="w-full text-white/40 text-[9px] tracking-widest uppercase hover:text-white"
          >
            CREATE_NEW_IDENTITY
          </button>
        </form>

        {isRegisterOpen && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm border border-white/10 p-10 bg-black shadow-2xl">
              <h2 className="text-white text-xl mb-8 tracking-[0.2em] uppercase">NEW_RECORD</h2>
              <form onSubmit={handleRegister} className="space-y-8">
                <input 
                  required
                  className="w-full bg-transparent border-b border-gray-800 text-gray-300 py-2 outline-none text-xs uppercase" 
                  placeholder="ASSIGN_IDENTITY" 
                  value={regData.username}
                  onChange={(e) => setRegData({...regData, username: e.target.value})}
                />
                <input 
                  required
                  type="password"
                  className="w-full bg-transparent border-b border-gray-800 text-gray-300 py-2 outline-none text-xs uppercase" 
                  placeholder="SET_SECURITY_CODE" 
                  value={regData.password}
                  onChange={(e) => setRegData({...regData, password: e.target.value})}
                />
                <div className="pt-4 flex flex-col gap-4">
                  <button type="submit" className="w-full border border-white/20 text-white/70 py-2 tracking-[0.4em] hover:bg-white/10 hover:text-white transition-all uppercase text-[10px]">
                    [ COMMIT_CHANGES ]
                  </button>
                  <button type="button" onClick={() => setIsRegisterOpen(false)} className="text-[9px] text-red-900 hover:text-red-600 tracking-widest uppercase">
                    ABORT_REGISTRATION
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login