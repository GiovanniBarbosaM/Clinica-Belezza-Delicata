const express = require('express');
const router = express.Router();

// Rota para enviar mensagens
router.post('/mensagens', (req, res) => {
    const { nome, email, mensagem } = req.body;
    // Aqui você pode armazenar a mensagem no banco de dados ou enviar um e-mail

    // Exemplo de resposta
    res.json({ message: 'Mensagem enviada com sucesso!' });
});

module.exports = router;
