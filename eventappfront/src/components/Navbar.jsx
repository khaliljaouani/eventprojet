import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function MyNavbar({ user, onLogout }) {
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/events">Tous les événements</Navbar.Brand>
        <Nav className="me-auto">
          {user && ( <Nav.Link as={Link} to="/myevents">Mes Evenements</Nav.Link> )}
         
        </Nav>
        <Nav>
          {!user && <Nav.Link as={Link} to="/">Connecte-toi</Nav.Link>}
          {user && (
            <>
              <Navbar.Text className="me-3">Bonjour, {user.firstname}</Navbar.Text>
              <button className="btn btn-outline-light" onClick={onLogout}>Déconnexion</button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
