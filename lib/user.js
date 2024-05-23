import db from "./db";

export function createUser(email, password) {
    const results = db
        .prepare('INSERT INTO users (email, password) VALUES (?, ?)')
        .run(email, password);

    return results.lastInsertRowid;
}

export function getUserByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}
