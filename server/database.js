const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'farm.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('farmer', 'consumer', 'admin')) NOT NULL,
      location_lat REAL,
      location_lng REAL,
      location_text TEXT,
      kyc_status TEXT CHECK(kyc_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      price_per_kg REAL NOT NULL,
      available_qty REAL NOT NULL,
      harvest_date DATE,
      unit TEXT DEFAULT 'kg',
      image_url TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farmer_id) REFERENCES users (id)
    )`);

        // Orders Table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_uuid TEXT UNIQUE,
      buyer_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      payment_method TEXT CHECK(payment_method IN ('COD', 'UPI')),
      payment_reference TEXT,
      status TEXT CHECK(status IN ('Pending', 'Processing', 'Packed', 'Delivered', 'Rejected')) DEFAULT 'Pending',
      delivery_address TEXT,
      delivery_slot TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (buyer_id) REFERENCES users (id)
    )`);

        // Order Items Table
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      farmer_id INTEGER NOT NULL,
      quantity REAL NOT NULL,
      price_per_kg REAL NOT NULL,
      line_total REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id),
      FOREIGN KEY (farmer_id) REFERENCES users (id)
    )`);

        // Reviews Table
        db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      farmer_id INTEGER NOT NULL,
      buyer_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id),
      FOREIGN KEY (farmer_id) REFERENCES users (id),
      FOREIGN KEY (buyer_id) REFERENCES users (id)
    )`);
    });
}

module.exports = { db, initDb };
