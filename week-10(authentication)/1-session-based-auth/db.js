import Database from "better-sqlite3";
export const db = new Database("./auth.db", { verbose: console.log });

db.exec(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
`);
