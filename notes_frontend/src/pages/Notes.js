// src/pages/Notes.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Notes.css';

function Notes() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/notes/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`http://localhost:8000/api/notes/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="notes-container">
      <h2>Your Notes</h2>
      <div className="notes-buttons">
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => navigate('/note')}>Create Note</button>
      </div>
      <ul>
        {notes.map(note => (
          <li key={note.id} className="note">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>{new Date(note.created_at).toLocaleString()}</small>
            <div className="note-actions">
              <Link to={`/note/${note.id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => handleDelete(note.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;
