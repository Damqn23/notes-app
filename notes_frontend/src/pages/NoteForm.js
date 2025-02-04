// src/pages/NoteForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/NoteForm.css';

function NoteForm() {
  const { id } = useParams(); // If present, we are in edit mode.
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (id) {
      // Fetch the note data if editing
      axios.get(`http://localhost:8000/api/notes/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(response => {
        setTitle(response.data.title);
        setContent(response.data.content);
      })
      .catch(err => {
        console.error('Error fetching note details:', err);
      });
    }
  }, [id, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Update existing note
        await axios.put(`http://localhost:8000/api/notes/${id}/`, { title, content }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      } else {
        // Create new note
        await axios.post('http://localhost:8000/api/notes/', { title, content }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
      navigate('/');
    } catch (err) {
      console.error('Error submitting note:', err);
    }
  };

  return (
    <div className="noteform-container">
      <h2>{id ? 'Edit Note' : 'Create Note'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea 
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">{id ? 'Update Note' : 'Create Note'}</button>
        <button type="button" className="cancel" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  );
}

export default NoteForm;
