// routes/agendamentos.js
const express = require('express');
const router = express.Router();
const Agendamento = require('../models/agendamento');

// Rota para agendar consultas
router.post('/', async (req, res) => {
    const { paciente_id, profissional_id, data_horario, observacoes } = req.body;
    try {
        const agendamento = await Agendamento.create(paciente_id, profissional_id, data_horario, observacoes);
        res.status(201).json({ id: agendamento.id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para listar agendamentos
router.get('/', async (req, res) => {
    try {
        const agendamentos = await Agendamento.listar();
        res.json(agendamentos);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar agendamentos.' });
    }
});

// Rota para buscar agendamento por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const agendamento = await Agendamento.buscarPorId(id);
        if (!agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }
        res.json(agendamento);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar agendamento.' });
    }
});

// Rota para atualizar agendamento por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { paciente_id, profissional_id, data_horario, observacoes } = req.body;
    try {
        const resultado = await Agendamento.atualizar(id, paciente_id, profissional_id, data_horario, observacoes);
        if (resultado.changes === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }
        res.json({ message: 'Agendamento atualizado com sucesso.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para excluir agendamento por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await Agendamento.excluir(id);
        if (resultado.changes === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }
        res.json({ message: 'Agendamento excluído com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao excluir agendamento.' });
    }
});

module.exports = router;
