// report.js

// Função para carregar relatório de agendamentos
document.getElementById('load-appointments-report').addEventListener('click', () => {
    fetch('/api/appointments')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('appointments-report-body');
            tbody.innerHTML = ''; // Limpa o corpo da tabela

            data.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment.id}</td>
                    <td>${appointment.patient}</td>
                    <td>${appointment.doctor}</td>
                    <td>${new Date(appointment.time).toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });

            document.getElementById('appointments-report-table').style.display = 'table';
        })
        .catch(error => console.error('Erro ao carregar agendamentos:', error));
});

// Função para carregar relatório de pacientes
document.getElementById('load-patients-report').addEventListener('click', () => {
    fetch('/api/patients')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('patients-report-body');
            tbody.innerHTML = ''; // Limpa o corpo da tabela

            data.forEach(patient => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${patient.id}</td>
                    <td>${patient.name}</td>
                    <td>${patient.email}</td>
                    <td>${patient.phone}</td>
                `;
                tbody.appendChild(row);
            });

            document.getElementById('patients-report-table').style.display = 'table';
        })
        .catch(error => console.error('Erro ao carregar pacientes:', error));
});
