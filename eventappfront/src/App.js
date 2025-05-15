import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AllEvents from "./pages/AllEvents";
import MyEvents from "./pages/MyEvents";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/main.css';


function App() {
  // Persistance de connexion
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<AllEvents user={user} />} />
        <Route path="/myevents" element={
          <ProtectedRoute user={user}>
            <MyEvents user={user} />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
