import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";

export default function MyEvents({ user }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", availableSeats: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) fetchMyEvents();
    // eslint-disable-next-line
  }, [user]);

  const fetchMyEvents = async () => {
    const res = await axios.get("http://localhost:3001/api/events");
    // Filtrer seulement les événements créés par l'utilisateur connecté
    setEvents(res.data.filter(ev => ev.creator_id === user.id));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/events", {
        ...form,
        creator_id: user.id
      });
      setForm({ name: "", date: "", availableSeats: "" });
      setMessage("Événement ajouté !");
      fetchMyEvents();
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Erreur lors de l'ajout.");
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Supprimer cet événement ?")) return;
    await axios.delete(`http://localhost:3001/api/events/${eventId}`);
    fetchMyEvents();
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Mes événements</h2>
      {/* Formulaire d'ajout d'événement */}
      <Form className="mb-4 p-4 border rounded shadow-sm bg-light" onSubmit={handleAddEvent}>
        <Row className="g-2 align-items-end">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Nom de l'événement</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                required
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Nom"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={form.date}
                required
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Places</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={form.availableSeats}
                required
                onChange={e => setForm({ ...form, availableSeats: e.target.value })}
                placeholder="Nombre de places"
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button type="submit" variant="success" className="w-100">
              Ajouter
            </Button>
          </Col>
        </Row>
        {message && <div className="mt-2 alert alert-info py-1">{message}</div>}
      </Form>
      {/* Liste de mes événements */}
      <Row>
        {events.length === 0 && (
          <div className="text-center text-muted">Aucun événement créé par vous.</div>
        )}
        {events.map(event => (
          <Col md={6} lg={4} key={event.id} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>
                  {event.name}{" "}
                  {event.availableSeats === 0 && (
                    <Badge bg="danger" className="ms-2">Complet</Badge>
                  )}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {new Date(event.date).toLocaleDateString()}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Places restantes :</strong> {event.availableSeats}
                </Card.Text>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(event.id)}
                >
                  Supprimer
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
