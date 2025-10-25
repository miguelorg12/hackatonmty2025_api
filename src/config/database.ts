import { Pool } from 'pg';
import 'dotenv/config';

const db = new Pool({
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'mydatabase',
    user: process.env.PGUSER || 'myuser',
    password: process.env.PGPASSWORD || 'mypassword',
    port: parseInt(process.env.PGPORT || '5432'),
    ssl: { 
        rejectUnauthorized: false 
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export default db;

db.connect()
    .then(client => {
        client.release();
    })
    .catch(error => {
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    });

process.on('SIGINT', () => {
    db.end().then(() => {
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    db.end().then(() => {
        process.exit(0);
    });
});