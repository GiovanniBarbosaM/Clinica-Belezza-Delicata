// routes/pacientes.js
const express = require('express');
const router = express.Router();
const Paciente = require('../models/paciente');

// Rota para registrar pacientes
router.post('/', async (req, res) => {
    const { nome, email, telefone, data_nascimento } = req.body;
    try {
        const paciente = await Paciente.create(nome, email, telefone, data_nascimento);
        res.status(201).json({ id: paciente.id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para listar pacientes
router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.listar();
        res.json(pacientes);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar pacientes.' });
    }
});

// Rota para buscar paciente por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await Paciente.buscarPorId(id);
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado.' });
        }
        res.json(paciente);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar paciente.' });
    }
});

// Rota para atualizar paciente por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, data_nascimento } = req.body;
    try {
        const resultado = await Paciente.atualizar(id, nome, email, telefone, data_nascimento);
        if (resultado.changes === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado.' });
        }
        res.json({ message: 'Paciente atualizado com sucesso.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para excluir paciente por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await Paciente.excluir(id);
        if (resultado.changes === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado.' });
        }
        res.json({ message: 'Paciente excluído com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao excluir paciente.' });
    }
});

module.exports = router;
