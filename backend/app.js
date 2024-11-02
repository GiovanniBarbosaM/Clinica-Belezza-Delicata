const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Certifique-se de que o módulo 'database' está configurado corretamente
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint para obter agendamentos
app.get('/api/appointments', (req, res) => {
    db.all("SELECT * FROM appointments", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint para agendar uma consulta
app.post('/api/schedule', (req, res) => {
    const { patient, doctor, time } = req.body;
    const stmt = db.prepare("INSERT INTO appointments (patient, doctor, time) VALUES (?, ?, ?)");
    stmt.run(patient, doctor, time, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, patient, doctor, time });
    });
    stmt.finalize();
});

// Endpoint para cadastrar novos pacientes
app.post('/api/patients', (req, res) => {
    const { name, email, phone, dob, address, weight } = req.body;
    const stmt = db.prepare("INSERT INTO patients (name, email, phone, dob, address, weight) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(name, email, phone, dob, address, weight, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name, email, phone, dob, address, weight });
    });
    stmt.finalize();
});

// Conectar ao banco de dados e iniciar o servidor
db.connect().then(() => {
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    });
}).catch(err => {
    console.error("Erro ao conectar ao banco de dados:", err.message);
});
