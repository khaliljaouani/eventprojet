import React from "react";

const EventList = ({ events, onSelect }) => (
  <div>
    <h2>Liste des événements</h2>
    <ul>
      {events.map(event => (
        <li key={event.id} onClick={() => onSelect(event)}>
          {event.name} - {event.date} - {event.availableSeats} places restantes
        </li>
      ))}
    </ul>
  </div>
);

export default EventList;
