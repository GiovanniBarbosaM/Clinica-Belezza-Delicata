// db.js
const sqlite3 = require('sqlite3').verbose();
const config = require('./config');

let db = new sqlite3.Database(config.db.filename, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

module.exports = db;
// server.js (adição dentro do db.serialize)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS consultas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paciente_id INTEGER,
        data_hora TEXT,
        profissional TEXT,
        especialidade TEXT,
        observacoes TEXT,
        FOREIGN KEY (paciente_id) REFERENCES pacientes (id)
    )`);
});
