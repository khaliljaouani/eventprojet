import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const fakeEvents = [
  { id: 1, name: "Concert Pop", date: "2025-06-01", availableSeats: 120 },
  { id: 2, name: "Conférence IA", date: "2025-06-10", availableSeats: 60 },
  { id: 3, name: "Exposition Art", date: "2025-07-03", availableSeats: 200 },
];

export default function Booking() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = fakeEvents.find(e => e.id === Number(eventId));

  function handleSubmit(e) {
    e.preventDefault();
    alert("Réservation envoyée !");
    navigate("/events");
  }

  if (!event) return <div>Événement non trouvé.</div>;

  return (
    <div>
      <h2>Réserver pour : {event.name}</h2>
      <p>Date : {event.date}</p>
      <p>Places restantes : {event.availableSeats}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de places :
          <input type="number" min="1" max={event.availableSeats} defaultValue={1} />
        </label>
        <button type="submit">Réserver</button>
      </form>
    </div>
  );
}
