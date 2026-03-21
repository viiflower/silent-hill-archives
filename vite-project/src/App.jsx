import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Characters from './pages/Characters';
import Monsters from './pages/Monsters';
import AddCharacter from './pages/AddCharacter';
import AddMonster from './pages/AddMonster';

// Un componente de ruta protegida para que nadie entre sin login
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <div className="App">
      <Routes>
        {/* Ruta de Login (Pública) */}
        <Route path="/" element={<Login />} />

        {/* Rutas Protegidas (Requieren Login) */}
        <Route path="/characters" element={
          <ProtectedRoute>
            <Characters />
          </ProtectedRoute>
        } />
        
        <Route path="/monsters" element={
          <ProtectedRoute>
            <Monsters />
          </ProtectedRoute>
        } />

        <Route path="/add-character" element={
          <ProtectedRoute>
            <AddCharacter />
          </ProtectedRoute>
        } />

        <Route path="/add-monster" element={
          <ProtectedRoute>
            <AddMonster />
          </ProtectedRoute>
        } />

        {/* Si el usuario escribe una ruta que no existe, mándalo al login o a characters */}
        <Route path="*" element={<Navigate to="/characters" replace />} />
      </Routes>
    </div>
  );
};

export default App;