import React, { useState } from "react";

const BookingForm = ({ event, onBook }) => {
  const [seats, setSeats] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook(event.id, seats);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre de places à réserver :
        <input
          type="number"
          min="1"
          max={event.availableSeats}
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />
      </label>
      <button type="submit">Réserver</button>
    </form>
  );
};

export default BookingForm;
