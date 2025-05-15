// src/pages/Home.jsx
import React from "react";

export default function Home({ user }) {
  return (
    <div>
      <h1>Bienvenue sur EventBookingApp</h1>
      {user && (
        <p>Bonjour, {user.firstname} {user.lastname} !</p>
      )}
      <p>Utilisez la barre de navigation pour accéder aux événements.</p>
    </div>
  );
}
