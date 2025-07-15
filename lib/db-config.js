// Database configuration
// Change this to switch between different database types in the future

export const DATABASE_CONFIG = {
  type: 'mongodb', // Options: 'sqlite', 'postgres', 'mysql', 'mongodb'
  
  // SQLite configuration
  sqlite: {
    filename: 'automation_database.db',
    path: process.cwd()
  },
  
  // Future database configurations can be added here
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'automation_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  },
  
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'automation_db',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/automation_db',
    dbName: process.env.MONGODB_DB_NAME || 'automation_db'
  }
};

// Database adapter factory - can be extended to support different databases
export function createDatabaseAdapter() {
  switch (DATABASE_CONFIG.type) {
    case 'sqlite':
      // Current SQLite implementation
      const sqliteAdapter = require('./database');
      return sqliteAdapter;
    
    case 'postgres':
      // Future: return require('./adapters/postgres');
      throw new Error('PostgreSQL adapter not implemented yet');
    
    case 'mysql':
      // Future: return require('./adapters/mysql');
      throw new Error('MySQL adapter not implemented yet');
    
    case 'mongodb':
      // MongoDB implementation
      return require('./mongodb-adapter');
    
    default:
      throw new Error(`Unsupported database type: ${DATABASE_CONFIG.type}`);
  }
}
