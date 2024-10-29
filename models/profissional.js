// models/profissional.js
const db = require('../db');

const Profissional = {
    // Criar um novo profissional
    criar: async (nome, especialidade) => {
        const sql = `INSERT INTO profissionais (nome, especialidade) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(sql, [nome, especialidade], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ id: this.lastID });
            });
        });
    },

    // Listar todos os profissionais
    listar: async () => {
        const sql = `SELECT * FROM profissionais`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    },

    // Buscar profissional por ID
    buscarPorId: async (id) => {
        const sql = `SELECT * FROM profissionais WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    },

    // Atualizar profissional por ID
    atualizar: async (id, nome, especialidade) => {
        const sql = `UPDATE profissionais SET nome = ?, especialidade = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [nome, especialidade, id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ changes: this.changes });
            });
        });
    },

    // Excluir profissional por ID
    excluir: async (id) => {
        const sql = `DELETE FROM profissionais WHERE id = ?`;
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

module.exports = Profissional;
