const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root', // ou 'eventuser'
  password: 'root', // ton mot de passe MariaDB
  database: 'eventdb',
  connectionLimit: 5
});

// ----------------------
// INSCRIPTION UTILISATEUR
// ----------------------
app.post('/api/users/register', async (req, res) => {
  const { firstname, lastname, username, password } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    // Vérifier si le username existe déjà
    const existing = await conn.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
    }
    // Insérer le nouvel utilisateur
    const result = await conn.query(
      'INSERT INTO users (firstname, lastname, username, password) VALUES (?, ?, ?, ?)',
      [firstname, lastname, username, password]
    );
    res.status(201).json({ id: result.insertId, firstname, lastname, username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// ----------------------
// LOGIN UTILISATEUR
// ----------------------
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const users = await conn.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (users.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    // Connexion réussie
    const user = users[0];
    res.json({ id: user.id, firstname: user.firstname, lastname: user.lastname, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// ----------------------
// AJOUTER UN EVENEMENT
// ----------------------
app.post('/api/events', async (req, res) => {
  const { name, date, availableSeats, creator_id } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO events (name, date, availableSeats, creator_id) VALUES (?, ?, ?, ?)",
      [name, date, availableSeats, creator_id]
    );
    res.status(201).json({ id: result.insertId, name, date, availableSeats, creator_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// ----------------------
// AFFICHER TOUS LES EVENEMENTS (AVEC CREATEUR)
// ----------------------
app.get('/api/events', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT events.*, users.firstname, users.lastname
      FROM events
      JOIN users ON events.creator_id = users.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// ----------------------
// MODIFIER UN EVENEMENT
// ----------------------
app.put('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date, availableSeats, creator_id } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      "UPDATE events SET name = ?, date = ?, availableSeats = ?, creator_id = ? WHERE id = ?",
      [name, date, availableSeats, creator_id, id]
    );
    res.json({ id, name, date, availableSeats, creator_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// ----------------------
// SUPPRIMER UN EVENEMENT
// ----------------------
app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM events WHERE id = ?", [id]);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// ----------------------
// RESERVER UN EVENEMENT
// ----------------------
app.post('/api/reservations', async (req, res) => {
  const { user_id, event_id } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    // Vérifier les places restantes
    const [event] = await conn.query("SELECT availableSeats FROM events WHERE id = ?", [event_id]);
    if (!event || event.availableSeats < 1) {
      return res.status(400).json({ error: "Plus de places disponibles" });
    }
    // Créer la réservation
    await conn.query("INSERT INTO reservations (user_id, event_id) VALUES (?, ?)", [user_id, event_id]);
    // Décrémenter les places
    await conn.query("UPDATE events SET availableSeats = availableSeats - 1 WHERE id = ?", [event_id]);
    res.status(201).json({ message: "Réservation effectuée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// ----------------------
// AFFICHER LES RESERVATIONS D'UN UTILISATEUR
// ----------------------
app.get('/api/reservations/:user_id', async (req, res) => {
  const { user_id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT reservations.*, events.name AS event_name, events.date
      FROM reservations
      JOIN events ON reservations.event_id = events.id
      WHERE reservations.user_id = ?
    `, [user_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// ----------------------
// DEMARRER LE SERVEUR
// ----------------------
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
