import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";


export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/users/login', form);
      onLogin(res.data);
      setError('');
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la connexion');
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center" style={{background: "#f8f9fa"}}>
      <div className="card shadow p-4" style={{minWidth: 350, maxWidth: 400, width: "100%"}}>
        <div className="text-center mb-4">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="login" style={{width: 120}} />
          <h3 className="mt-3">Connect-toi</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              className="form-control"
              value={form.username}
              required
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="Nom d'utilisateur"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              required
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Mot de passe"
            />
          </div>
          {error && <div className="alert alert-danger py-1">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Se connecter</button>
        </form>
        <div className="text-center mt-3">
          <span>Vous n'avez pas de compte ? </span>
          <Link to="/register" className="link-primary">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}
