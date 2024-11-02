const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./clinic.db');

function connect() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY, patient TEXT, doctor TEXT, time TEXT)", (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    });
}

module.exports = { connect };
