// models/paciente.js
const db = require('../db');

const Paciente = {
    // Criar um novo paciente
    criar: async (nome, email, telefone, data_nascimento) => {
        const sql = `INSERT INTO pacientes (nome, email, telefone, data_nascimento) VALUES (?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(sql, [nome, email, telefone, data_nascimento], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ id: this.lastID });
            });
        });
    },

    // Listar todos os pacientes
    listar: async () => {
        const sql = `SELECT * FROM pacientes`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    },

    // Buscar paciente por ID
    buscarPorId: async (id) => {
        const sql = `SELECT * FROM pacientes WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    },

    // Atualizar paciente por ID
    atualizar: async (id, nome, email, telefone, data_nascimento) => {
        const sql = `UPDATE pacientes SET nome = ?, email = ?, telefone = ?, data_nascimento = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [nome, email, telefone, data_nascimento, id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ changes: this.changes });
            });
        });
    },

    // Excluir paciente por ID
    excluir: async (id) => {
        const sql = `DELETE FROM pacientes WHERE id = ?`;
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

module.exports = Paciente;
