// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db'); // Módulo para gerenciar o banco de dados
const pacientesRoutes = require('./routes/pacientes');
const profissionaisRoutes = require('./routes/profissionais');
const agendamentosRoutes = require('./routes/agendamentos');
const mensagensRoutes = require('./routes/mensagens');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rotas
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/profissionais', profissionaisRoutes);
app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api/mensagens', mensagensRoutes); // Rota para mensagens

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Inicializar banco de dados
const initializeDatabase = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS pacientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT,
            telefone TEXT,
            data_nascimento TEXT,
            historico TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS profissionais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            especialidade TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paciente_id INTEGER,
            profissional_id INTEGER,
            data_horario DATETIME,
            FOREIGN KEY (paciente_id) REFERENCES pacientes (id),
            FOREIGN KEY (profissional_id) REFERENCES profissionais (id)
        )`);
    });
};

// Configurar transporte de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'seu_email@gmail.com',
        pass: 'sua_senha'
    }
});

// Função para enviar e-mail
const enviarEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'seu_email@gmail.com',
        to,
        subject,
        text
    };

    return transporter.sendMail(mailOptions);
};

// Enviar e-mail de lembrete de consulta
const enviarLembrete = (email, data_hora) => {
    const textoLembrete = `Olá! Lembramos que você tem uma consulta agendada para o dia ${data_hora}.`;
    enviarEmail(email, 'Lembrete de Consulta Agendada', textoLembrete)
        .then(info => console.log('Email enviado:', info.response))
        .catch(error => console.log('Erro ao enviar o e-mail:', error));
};

// Inicializar banco de dados e iniciar servidor
const startServer = () => {
    initializeDatabase();
    
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
};

// Iniciar o servidor
startServer();
