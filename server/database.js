const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users Table
    await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT CHECK(role IN ('farmer', 'consumer', 'admin')) NOT NULL,
                location_lat NUMERIC,
                location_lng NUMERIC,
                location_text TEXT,
                kyc_status TEXT CHECK(kyc_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    // Products Table
    await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                farmer_id INTEGER NOT NULL REFERENCES users(id),
                crop_name TEXT NOT NULL,
                price_per_kg NUMERIC NOT NULL,
                available_qty NUMERIC NOT NULL,
                harvest_date DATE,
                unit TEXT DEFAULT 'kg',
                image_url TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    // Orders Table
    await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                order_uuid TEXT UNIQUE,
                buyer_id INTEGER NOT NULL REFERENCES users(id),
                total_amount NUMERIC NOT NULL,
                payment_method TEXT CHECK(payment_method IN ('COD', 'UPI')),
                payment_reference TEXT,
                status TEXT CHECK(status IN ('Pending', 'Processing', 'Packed', 'Delivered', 'Rejected')) DEFAULT 'Pending',
                delivery_address TEXT,
                delivery_slot TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    // Order Items Table
    await client.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER NOT NULL REFERENCES orders(id),
                product_id INTEGER NOT NULL REFERENCES products(id),
                farmer_id INTEGER NOT NULL REFERENCES users(id),
                quantity NUMERIC NOT NULL,
                price_per_kg NUMERIC NOT NULL,
                line_total NUMERIC NOT NULL
            )
        `);

    // Reviews Table
    await client.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                order_id INTEGER NOT NULL REFERENCES orders(id),
                product_id INTEGER NOT NULL REFERENCES products(id),
                farmer_id INTEGER NOT NULL REFERENCES users(id),
                buyer_id INTEGER NOT NULL REFERENCES users(id),
                rating INTEGER CHECK(rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    await client.query('COMMIT');
    console.log('Database tables initialized');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error initializing database', e);
  } finally {
    client.release();
  }
};

module.exports = { pool, initDb };
