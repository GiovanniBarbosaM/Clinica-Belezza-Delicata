// Função para lidar com o envio do formulário
async function handleFormSubmit(formId, url, successMessage, responseMessageElementId) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!validarFormulario(form)) {
            document.getElementById(responseMessageElementId).textContent = 'Por favor, preencha todos os campos corretamente.';
            return;
        }

        const formData = Array.from(form.elements)
            .filter(input => input.tagName === 'INPUT' && input.type !== 'submit')
            .reduce((acc, input) => {
                acc[input.name] = input.value;
                return acc;
            }, {});

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            document.getElementById(responseMessageElementId).textContent = `${successMessage} ID: ${data.id}`;
            form.reset(); // Limpar formulário
        } catch (error) {
            document.getElementById(responseMessageElementId).textContent = `Erro: ${error.message}`;
        }
    });
}

// Função para carregar consultas agendadas
async function carregarConsultas() {
    try {
        const response = await fetch('http://localhost:3000/api/consultas');
        const data = await response.json();
        const consultasDiv = document.getElementById('consultas-agendadas');
        consultasDiv.innerHTML = '<ul>' + data.map(consulta => 
            `<li>ID: ${consulta.id}, Paciente ID: ${consulta.paciente_id}, Data: ${consulta.data_hora}, Profissional: ${consulta.profissional}, Especialidade: ${consulta.especialidade}</li>`
        ).join('') + '</ul>';
    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
    }
}

// Função para validar campos
function validarFormulario(form) {
    let valido = true;
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        if (!input.value) {
            valido = false;
            input.style.borderColor = 'red'; // Indica erro no campo
        } else {
            input.style.borderColor = '#ccc'; // Restaura a borda normal
        }
    });

    return valido;
}

// Chamar a função ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarConsultas();
    handleFormSubmit('cadastro-paciente', '/api/pacientes', 'Paciente cadastrado com sucesso!', 'response-message');
    handleFormSubmit('agendamento-consulta', '/api/consultas', 'Consulta agendada com sucesso!', 'agendamento-message');
    handleFormSubmit('mensagem-form', '/api/mensagens', 'Mensagem enviada com sucesso!', 'mensagem-response');
});
