import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ firstname: '', lastname: '', username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/users/register', form);
      setMessage('Inscription réussie ! Vous pouvez vous connecter.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center" style={{background: "#f8f9fa"}}>
      <div className="card shadow p-4" style={{minWidth: 350, maxWidth: 450, width: "100%"}}>
        <div className="text-center mb-4">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.png" alt="register" style={{width: 120}} />
          <h3 className="mt-3">Inscription</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Prénom</label>
            <input
              type="text"
              className="form-control"
              value={form.firstname}
              required
              onChange={e => setForm({ ...form, firstname: e.target.value })}
              placeholder="Prénom"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nom</label>
            <input
              type="text"
              className="form-control"
              value={form.lastname}
              required
              onChange={e => setForm({ ...form, lastname: e.target.value })}
              placeholder="Nom"
            />
          </div>
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
          {message && (
            <div className={`alert ${message.includes("réussie") ? "alert-success" : "alert-danger"} py-1`}>
              {message}
            </div>
          )}
          <button type="submit" className="btn btn-success w-100">S'inscrire</button>
        </form>
        <div className="text-center mt-3">
          <span>Vous avez déjà un compte ? </span>
          <Link to="/" className="link-primary">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
