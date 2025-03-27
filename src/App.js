import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5011/api/movies';

function App() {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    genre: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all movies
  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Create or Update a movie
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchMovies();
        setFormData({ title: '', year: '', genre: '' });
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  // Edit a movie
  const handleEdit = (movie) => {
    setFormData({
      title: movie.title,
      year: movie.year,
      genre: movie.genre
    });
    setEditingId(movie.id);
  };

  // Delete a movie
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMovies();
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div className="app">
      <h1>Movie Collection</h1>
      
      {/* Movie Form */}
      <form onSubmit={handleSubmit} className="movie-form">
        <h2>{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleInputChange}
          required
          min="1900"
          max="2099"
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          {editingId ? 'Update Movie' : 'Add Movie'}
        </button>
        {editingId && (
          <button type="button" onClick={() => {
            setFormData({ title: '', year: '', genre: '' });
            setEditingId(null);
          }}>
            Cancel
          </button>
        )}
      </form>

      {/* Movies List */}
      <div className="movies-list">
        <h2>Movies</h2>
        {movies.length === 0 ? (
          <p>No movies found. Add some movies!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Genre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id}>
                  <td>{movie.title}</td>
                  <td>{movie.year}</td>
                  <td>{movie.genre}</td>
                  <td>
                    <button onClick={() => handleEdit(movie)}>Edit</button>
                    <button onClick={() => handleDelete(movie.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;