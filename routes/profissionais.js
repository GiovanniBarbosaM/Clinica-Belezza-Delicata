// routes/profissionais.js
const express = require('express');
const router = express.Router();
const Profissional = require('../models/profissional');

// Rota para registrar profissionais
router.post('/', async (req, res) => {
    const { nome, especialidade } = req.body;
    try {
        const profissional = await Profissional.create(nome, especialidade);
        res.status(201).json({ id: profissional.id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para listar profissionais
router.get('/', async (req, res) => {
    try {
        const profissionais = await Profissional.listar();
        res.json(profissionais);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar profissionais.' });
    }
});

// Rota para buscar profissional por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const profissional = await Profissional.buscarPorId(id);
        if (!profissional) {
            return res.status(404).json({ message: 'Profissional não encontrado.' });
        }
        res.json(profissional);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar profissional.' });
    }
});

// Rota para atualizar profissional por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, especialidade } = req.body;
    try {
        const resultado = await Profissional.atualizar(id, nome, especialidade);
        if (resultado.changes === 0) {
            return res.status(404).json({ message: 'Profissional não encontrado.' });
        }
        res.json({ message: 'Profissional atualizado com sucesso.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para excluir profissional por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await Profissional.excluir(id);
        if (resultado.changes === 0) {
            return res.status(404).json({ message: 'Profissional não encontrado.' });
        }
        res.json({ message: 'Profissional excluído com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao excluir profissional.' });
    }
});

module.exports = router;
