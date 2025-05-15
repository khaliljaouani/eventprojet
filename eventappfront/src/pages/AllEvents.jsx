import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

export default function AllEvents({ user }) {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/api/events")
      .then(res => setEvents(res.data))
      .catch(() => {});
  }, []);
  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Tous les événements</h2>
      <Row>
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
                  <strong>Places restantes :</strong> {event.availableSeats}<br />
                  <strong>Créateur :</strong> {event.firstname} {event.lastname}
                </Card.Text>
                <Button
                  variant="primary"
                  disabled={event.availableSeats === 0 || !user}
                  onClick={() => {
                    if (!user) return alert("Connectez-vous pour réserver !");
                    axios.post("http://localhost:3001/api/reservations", {
                      user_id: user.id,
                      event_id: event.id,
                    }).then(() => alert("Réservation faite !"));
                  }}
                >
                  Réserver
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
