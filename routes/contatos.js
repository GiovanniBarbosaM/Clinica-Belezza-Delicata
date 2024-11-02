// routes/contact.js

const express = require('express');
const router = express.Router();

router.post('/enviar-mensagem', (req, res) => {
  const { nome, email, mensagem } = req.body;

  // Aqui, você pode processar a mensagem, como salvar no banco ou enviar um e-mail
  console.log(`Nova mensagem de ${nome}: ${mensagem}`);

  res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
});

module.exports = router;
// server.js

const express = require('express');
const app = express();
const contactRoutes = require('./routes/contact');

app.use(express.json());
app.use('/contact', contactRoutes);
