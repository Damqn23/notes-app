import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import NoteForm from './pages/NoteForm';

function App() {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Notes /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Create new note */}
        <Route path="/note" element={isAuthenticated ? <NoteForm /> : <Navigate to="/login" />} />
        {/* Edit existing note */}
        <Route path="/note/:id" element={isAuthenticated ? <NoteForm /> : <Navigate to="/login" />} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
