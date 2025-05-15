const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root', // ou 'eventuser' si tu as créé un utilisateur spécial
  password: 'root', // ton mot de passe root ou celui de eventuser
  database: 'eventdb',
  connectionLimit: 5
});
module.exports = pool;
