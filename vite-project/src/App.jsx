import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Characters from './pages/Characters';
import Monsters from './pages/Monsters';

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
        <Route path="/" element={<Login />} />
        
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

        <Route path="*" element={<Navigate to="/characters" replace />} />
      </Routes>
    </div>
  );
};

export default App;