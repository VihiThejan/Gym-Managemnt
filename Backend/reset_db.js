const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
};

async function resetDb() {
    try {
        console.log("Connecting to MySQL...");
        const connection = await mysql.createConnection(DB_CONFIG);
        console.log("Connected.");

        console.log("Dropping database 'gym_management'...");
        await connection.query("DROP DATABASE IF EXISTS gym_management");
        console.log("Database dropped.");

        console.log("Reading setup_database.sql...");
        const sqlPath = path.join(__dirname, 'setup_database.sql');
        const sql = await fs.readFile(sqlPath, 'utf8');

        console.log("Executing setup script...");
        await connection.query(sql);
        console.log("Database setup completed successfully.");

        await connection.end();
    } catch (error) {
        console.error("Error resetting database:", error);
    }
}

resetDb();
