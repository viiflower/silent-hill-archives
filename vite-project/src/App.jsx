// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Characters from "./pages/Characters";
import Monsters from "./pages/Monsters";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Routes>
        {/* La página de Login normalmente no lleva Navbar */}
        <Route path="/" element={<Login />} />
        
        {/* Las páginas de contenido sí llevan el Navbar arriba */}
        <Route path="/characters" element={<><Navbar /><Characters /></>} />
        <Route path="/monsters" element={<><Navbar /><Monsters /></>} />
      </Routes>
    </Router>
  );
}

export default App;