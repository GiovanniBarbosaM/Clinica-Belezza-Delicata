// Função para lidar com o envio do formulário
async function handleFormSubmit(formId, url, successMessage, responseMessageElementId) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm(form)) {
            displayMessage(responseMessageElementId, 'Por favor, preencha todos os campos corretamente.');
            return;
        }

        const formData = getFormData(form);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            displayMessage(responseMessageElementId, `${successMessage} ID: ${data.id}`);
            form.reset(); // Limpa o formulário
        } catch (error) {
            displayMessage(responseMessageElementId, `Erro: ${error.message}`);
        }
    });
}

// Função para obter os dados do formulário
function getFormData(form) {
    return Array.from(form.elements)
        .filter(input => input.tagName === 'INPUT' && input.type !== 'submit')
        .reduce((acc, input) => ({ ...acc, [input.name]: input.value }), {});
}

// Função para exibir mensagens
function displayMessage(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

// Função para carregar consultas agendadas
async function loadConsultations() {
    try {
        const response = await fetch('http://localhost:3000/api/consultas');
        const data = await response.json();
        const consultasDiv = document.getElementById('consultas-agendadas');
        consultasDiv.innerHTML = createConsultationList(data);
    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
    }
}

// Função para criar lista de consultas
function createConsultationList(data) {
    return `<ul>${data.map(consulta => 
        `<li>ID: ${consulta.id}, Paciente ID: ${consulta.paciente_id}, Data: ${consulta.data_hora}, Profissional: ${consulta.profissional}, Especialidade: ${consulta.especialidade}</li>`
    ).join('')}</ul>`;
}

// Função para validar campos
function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input').forEach(input => {
        if (!input.value) {
            isValid = false;
            input.style.borderColor = 'red'; // Indica erro no campo
        } else {
            input.style.borderColor = '#ccc'; // Restaura a borda normal
        }
    });
    return isValid;
}

// Função para carregar agendamentos disponíveis
function loadAvailableAppointments(appointments) {
    const container = document.getElementById('available-appointments');
    container.innerHTML = '';

    appointments.forEach(appt => {
        const docElement = document.createElement('div');
        docElement.innerHTML = createAppointmentHTML(appt);
        container.appendChild(docElement);
    });
}

// Função para criar HTML de agendamentos
function createAppointmentHTML(appt) {
    return `
        <h3>${appt.doctor} - ${appt.specialty}</h3>
        <ul>${appt.availableSlots.map(slot => `<li>${new Date(slot).toLocaleString()}</li>`).join('')}</ul>
    `;
}

// Função para agendar consultas
function scheduleAppointment(event) {
    event.preventDefault(); // Impede o envio do formulário

    const patientName = document.getElementById('patient-name').value;
    const doctor = document.getElementById('doctor').value;
    const time = document.getElementById('appointment-time').value;

    const appointment = appointments.find(appt => appt.doctor === doctor);
    if (appointment && appointment.availableSlots.includes(time)) {
        appointment.availableSlots = appointment.availableSlots.filter(slot => slot !== time);
        alert(`Consulta agendada com sucesso para ${patientName} com ${doctor} às ${new Date(time).toLocaleString()}.`);
    } else {
        alert('Horário não disponível.');
    }
}

// Função de autenticação
function authenticateUser(event) {
    event.preventDefault(); // Impede o envio do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username] === password) {
        alert('Login bem-sucedido!');
        window.location.href = 'admin.html';
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

// Função para carregar agendamentos no painel administrativo
async function loadAppointments() {
    try {
        const response = await fetch('/api/appointments');
        const data = await response.json();
        const tbody = document.getElementById('appointments-body');
        tbody.innerHTML = ''; // Limpa o corpo da tabela

        data.forEach(appointment => {
            const row = createAppointmentRow(appointment);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
    }
}

// Função para criar linha da tabela de agendamentos
function createAppointmentRow(appointment) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${appointment.id}</td>
        <td>${appointment.patient}</td>
        <td>${appointment.doctor}</td>
        <td>${new Date(appointment.time).toLocaleString()}</td>
        <td><button onclick="deleteAppointment(${appointment.id})">Excluir</button></td>
    `;
    return row;
}

// Função para cadastrar novos pacientes
async function registerPatient(event) {
    event.preventDefault(); // Impede o envio do formulário

    const patientData = getPatientData();

    try {
        const response = await fetch('/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData),
        });
        if (response.ok) {
            document.getElementById('registration-success').style.display = 'block';
            document.getElementById('register-form').reset(); // Limpa o formulário
        } else {
            alert('Erro ao cadastrar paciente.');
        }
    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
    }
}

// Função para obter dados do paciente
function getPatientData() {
    return {
        name: document.getElementById('patient-name').value,
        email: document.getElementById('patient-email').value,
        phone: document.getElementById('patient-phone').value,
        dob: document.getElementById('patient-dob').value,
        address: document.getElementById('patient-address').value,
        weight: document.getElementById('patient-weight').value,
    };
}

// Função para excluir um agendamento
async function deleteAppointment(id) {
    try {
        const response = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadAppointments(); // Recarrega os agendamentos
        } else {
            alert('Erro ao excluir agendamento.');
        }
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
    }
}

// Elementos do DOM
const doctorsList = document.getElementById('doctorsUl');
const appointmentsList = document.getElementById('appointmentsUl');
const doctorForm = document.getElementById('doctorForm');
const appointmentForm = document.getElementById('appointmentForm');
const calendarElement = document.getElementById('calendar');

// Simulação de usuários
const users = {
    admin: 'senhaadmin',
    cliente1: 'senhaCliente1'
};

// Armazena funcionários cadastrados
const employees = [];

// Função para inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
    setupFormListeners();
});

// Função para carregar dados iniciais
async function loadInitialData() {
    await fetchDoctors();
    const appointments = await fetchAppointments();
    initializeCalendar(appointments);
}

// Configura os ouvintes de eventos dos formulários
function setupFormListeners() {
    doctorForm.addEventListener('submit', handleDoctorSubmit);
    appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('newEmployeeForm').addEventListener('submit', handleNewEmployeeSubmit);
    document.getElementById('messageForm').addEventListener('submit', handleMessageSubmit);
}

// Função para autenticação
function authenticateUser(username, password) {
    return users[username] && users[username] === password;
}

// Função para obter médicos
async function fetchDoctors() {
    const response = await fetch('/doctors');
    const doctors = await response.json();
    populateDoctorSelect(doctors);
}

// Popula a lista de médicos
function populateDoctorSelect(doctors) {
    const doctorSelect = document.getElementById('doctorSelect');
    doctorSelect.innerHTML = '';
    doctors.forEach(doctor => {
        doctorSelect.innerHTML += `<option value="${doctor.id}">${doctor.name} - ${doctor.specialty}</option>`;
        doctorsList.innerHTML += `<li>${doctor.name} - ${doctor.specialty}</li>`;
    });
}

// Função para cadastrar médico
async function handleDoctorSubmit(event) {
    event.preventDefault();

    const doctorData = {
        name: document.getElementById('doctorName').value,
        specialty: document.getElementById('doctorSpecialty').value,
    };

    const response = await fetch('/doctors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctorData)
    });

    if (response.ok) {
        loadDoctors();
        doctorForm.reset();
    } else {
        alert('Erro ao cadastrar médico.');
    }
}

// Função para carregar agendamentos
async function fetchAppointments() {
    const response = await fetch('/appointments');
    return await response.json();
}

// Função para inicializar o calendário
function initializeCalendar(appointments) {
    const events = appointments.map(appointment => ({
        title: appointment.patient,
        start: appointment.time,
        end: new Date(new Date(appointment.time).getTime() + 60 * 60 * 1000)
    }));

    const calendar = new FullCalendar.Calendar(calendarElement, {
        initialView: 'dayGridMonth',
        events: events
    });

    calendar.render();
}

// Função para cadastrar novo funcionário
async function handleNewEmployeeSubmit(event) {
    event.preventDefault();

    const employeeData = {
        name: document.getElementById('employeeName').value,
        position: document.getElementById('employeePosition').value,
    };

    const response = await fetch('/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
    });

    if (response.ok) {
        employees.push(employeeData);
        alert('Funcionário cadastrado com sucesso!');
    } else {
        alert('Erro ao cadastrar funcionário.');
    }
}

// Função para exibir mensagens
function handleMessageSubmit(event) {
    event.preventDefault();
    const message = document.getElementById('messageText').value;
    alert('Mensagem enviada: ' + message);
}

// Inicializa os dados
document.addEventListener('DOMContentLoaded', () => {
    loadConsultations(); // Carrega as consultas ao carregar a página
});
// Inserir um funcionário
db.run(`INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)`, 
    ['João Silva', 'Gerente', 3000], 
    function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`Funcionário inserido com ID: ${this.lastID}`);
    }
);

// Inserir um cliente
db.run(`INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)`, 
    ['Maria Oliveira', '123456789', 'maria@example.com'], 
    function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`Cliente inserido com ID: ${this.lastID}`);
    }
);
db.serialize(() => {
    db.all(`SELECT * FROM funcionarios`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(`${row.id}: ${row.nome}, ${row.cargo}, ${row.salario}`);
        });
    });
});
db.run(`UPDATE funcionarios SET salario = ? WHERE id = ?`, [3500, 1], function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`Salário atualizado para ID ${this.changes}`);
});
db.run(`DELETE FROM funcionarios WHERE id = ?`, 1, function(err) {
    if (err) {
        return console.log(err.message);
    }
    console.log(`Funcionário com ID ${this.changes} foi excluído.`);
});
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conexão com o banco de dados fechada.');
});
document.getElementById('cadastro-funcionario').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cargo = document.getElementById('cargo').value;
    const salario = document.getElementById('salario').value;

    db.run(`INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)`, 
        [nome, cargo, salario], 
        function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`Funcionário inserido com ID: ${this.lastID}`);
            // Limpar o formulário após o cadastro
            document.getElementById('cadastro-funcionario').reset();
        }
    );
});
// Capturar o envio do formulário de funcionários
document.getElementById('cadastro-funcionario').addEventListener('submit', function(event) {
    event.preventDefault();
    const nome = document.getElementById('nome-funcionario').value;
    const cargo = document.getElementById('cargo-funcionario').value;
    const salario = document.getElementById('salario-funcionario').value;

    // Chama a função para cadastrar
    cadastrarFuncionario(nome, cargo, salario);
    this.reset(); // Limpar o formulário
});

// Capturar o envio do formulário de clientes
document.getElementById('cadastro-cliente').addEventListener('submit', function(event) {
    event.preventDefault();
    const nome = document.getElementById('nome-cliente').value;
    const telefone = document.getElementById('telefone-cliente').value;
    const email = document.getElementById('email-cliente').value;

    // Chama a função para cadastrar
    cadastrarCliente(nome, telefone, email);
    this.reset(); // Limpar o formulário
});
if (nome && cargo && salario) {
    cadastrarFuncionario(nome, cargo, salario);
} else {
    alert('Por favor, preencha todos os campos corretamente.');
}
