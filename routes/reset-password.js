// reset-password.js

document.getElementById('reset-password-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o envio do formulário

    const email = document.getElementById('reset-email').value;

    // Lógica para enviar e-mail de recuperação de senha (simulada)
    console.log(`Instruções de recuperação de senha enviadas para ${email}`);
    
    document.getElementById('reset-success').style.display = 'block'; // Exibe mensagem de sucesso
});
