const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Database configuration
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'gym_management',
    port: process.env.DB_PORT || 3306
};

// Configuration without database (for initial connection)
const DB_CONFIG_WITHOUT_DB = {
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    port: DB_CONFIG.port,
    multipleStatements: true
};

/**
 * Check if database exists
 */
async function checkDatabaseExists(connection) {
    try {
        const [rows] = await connection.query(
            `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
            [DB_CONFIG.database]
        );
        return rows.length > 0;
    } catch (error) {
        console.error('Error checking database existence:', error.message);
        return false;
    }
}

/**
 * Check if tables exist in database
 */
async function checkTablesExist(connection) {
    try {
        const [rows] = await connection.query(
            `SELECT COUNT(*) as table_count FROM INFORMATION_SCHEMA.TABLES 
             WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'`,
            [DB_CONFIG.database]
        );
        return rows[0].table_count > 0;
    } catch (error) {
        console.error('Error checking tables:', error.message);
        return false;
    }
}

/**
 * Create database from SQL file
 */
async function createDatabaseFromSQL() {
    let connection;
    try {
        console.log('📦 Database not found or incomplete. Initializing database...');
        
        // Connect without selecting a database
        connection = await mysql.createConnection(DB_CONFIG_WITHOUT_DB);
        console.log('✅ Connected to MySQL server');

        // Read the SQL setup file
        const sqlFilePath = path.join(__dirname, '../../setup_database.sql');
        console.log('📄 Reading SQL file from:', sqlFilePath);
        
        const sqlContent = await fs.readFile(sqlFilePath, 'utf8');
        console.log('✅ SQL file loaded successfully');

        // Execute the SQL file
        console.log('🔄 Executing database setup script...');
        await connection.query(sqlContent);
        console.log('✅ Database created successfully!');

        await connection.end();
        return true;
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        if (connection) {
            await connection.end();
        }
        throw error;
    }
}

/**
 * Initialize database connection
 */
async function initializeDatabase() {
    let connection;
    try {
        console.log('🔍 Checking database connection...');
        
        // Try to connect without database first
        connection = await mysql.createConnection(DB_CONFIG_WITHOUT_DB);
        
        // Check if database exists
        const dbExists = await checkDatabaseExists(connection);
        
        if (!dbExists) {
            console.log(`⚠️  Database '${DB_CONFIG.database}' does not exist`);
            await connection.end();
            await createDatabaseFromSQL();
        } else {
            console.log(`✅ Database '${DB_CONFIG.database}' exists`);
            
            // Switch to the database
            await connection.query(`USE ${DB_CONFIG.database}`);
            
            // Check if tables exist
            const tablesExist = await checkTablesExist(connection);
            
            if (!tablesExist) {
                console.log('⚠️  Database exists but tables are missing');
                await connection.end();
                await createDatabaseFromSQL();
            } else {
                console.log('✅ Database tables verified');
                await connection.end();
            }
        }

        // Create a new connection pool for the application
        const pool = mysql.createPool({
            ...DB_CONFIG,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test the pool connection
        const testConnection = await pool.getConnection();
        await testConnection.ping();
        testConnection.release();
        
        console.log('✅ Database connection pool created successfully');
        console.log(`🚀 Connected to database: ${DB_CONFIG.database}`);
        
        return pool;
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        if (connection) {
            await connection.end();
        }
        throw error;
    }
}

/**
 * Get database connection pool
 */
let dbPool = null;

async function getDatabase() {
    if (!dbPool) {
        dbPool = await initializeDatabase();
    }
    return dbPool;
}

/**
 * Close database connection
 */
async function closeDatabase() {
    if (dbPool) {
        await dbPool.end();
        dbPool = null;
        console.log('Database connection closed');
    }
}

module.exports = {
    initializeDatabase,
    getDatabase,
    closeDatabase,
    DB_CONFIG
};
