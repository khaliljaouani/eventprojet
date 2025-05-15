import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


//connexion


export function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:3001/api/users/login', form);
    onLogin(res.data);
    // Sauvegarde le user dans localStorage
    localStorage.setItem("user", JSON.stringify(res.data));
    setError('');
    navigate('/events');
  } catch (err) {
    setError(err.response?.data?.error || 'Erreur lors de la connexion');
  }
};


  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom d'utilisateur" value={form.username} required onChange={e => setForm({ ...form, username: e.target.value })} />
        <input type="password" placeholder="Mot de passe" value={form.password} required onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}




// Composant Inscription
export function Register() {
  const [form, setForm] = useState({ firstname: '', lastname: '', username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/users/register', form);
      setMessage('Inscription réussie !');
      setForm({ firstname: '', lastname: '', username: '', password: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Prénom" value={form.firstname} required onChange={e => setForm({ ...form, firstname: e.target.value })} />
        <input type="text" placeholder="Nom" value={form.lastname} required onChange={e => setForm({ ...form, lastname: e.target.value })} />
        <input type="text" placeholder="Nom d'utilisateur" value={form.username} required onChange={e => setForm({ ...form, username: e.target.value })} />
        <input type="password" placeholder="Mot de passe" value={form.password} required onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit">S'inscrire</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}