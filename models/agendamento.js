// models/agendamento.js
const db = require('../db');

const Agendamento = {
    // Criar um novo agendamento
    criar: async (paciente_id, profissional_id, data_horario, observacoes) => {
        const sql = `INSERT INTO agendamentos (paciente_id, profissional_id, data_horario, observacoes) VALUES (?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(sql, [paciente_id, profissional_id, data_horario, observacoes], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ id: this.lastID });
            });
        });
    },

    // Listar todos os agendamentos
    listar: async () => {
        const sql = `SELECT * FROM agendamentos`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    },

    // Buscar agendamento por ID
    buscarPorId: async (id) => {
        const sql = `SELECT * FROM agendamentos WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    },

    // Atualizar agendamento por ID
    atualizar: async (id, paciente_id, profissional_id, data_horario, observacoes) => {
        const sql = `UPDATE agendamentos SET paciente_id = ?, profissional_id = ?, data_horario = ?, observacoes = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [paciente_id, profissional_id, data_horario, observacoes, id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ changes: this.changes });
            });
        });
    },

    // Excluir agendamento por ID
    excluir: async (id) => {
        const sql = `DELETE FROM agendamentos WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ changes: this.changes });
            });
        });
    }
};

module.exports = Agendamento;
