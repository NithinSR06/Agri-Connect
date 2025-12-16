const { db, initDb } = require('../database');
const bcrypt = require('bcryptjs');

const seed = async () => {
    console.log('Seeding database...');

    // Ensure tables exist
    initDb();

    const passwordHash = await bcrypt.hash('password123', 10);

    db.serialize(() => {
        // Clear existing data
        db.run('DELETE FROM users');
        db.run('DELETE FROM products');
        db.run('DELETE FROM orders');
        db.run('DELETE FROM order_items');
        db.run('DELETE FROM reviews');

        // Create Farmers
        const farmers = [
            { name: 'Ramesh Kumar', email: 'ramesh@farm.com', lat: 12.9716, lng: 77.5946, loc: 'Bangalore North' },
            { name: 'Suresh Gowda', email: 'suresh@farm.com', lat: 12.9352, lng: 77.6245, loc: 'Koramangala' },
            { name: 'Lakshmi Devi', email: 'lakshmi@farm.com', lat: 13.0352, lng: 77.5645, loc: 'Hebbal' }
        ];

        farmers.forEach(f => {
            db.run(`INSERT INTO users (name, email, password_hash, role, location_lat, location_lng, location_text, kyc_status) 
              VALUES (?, ?, ?, 'farmer', ?, ?, ?, 'verified')`,
                [f.name, f.email, passwordHash, f.lat, f.lng, f.loc]);
        });

        // Create Consumers
        const consumers = [
            { name: 'Anjali Rao', email: 'anjali@gmail.com', lat: 12.9784, lng: 77.6408, loc: 'Indiranagar' },
            { name: 'Rahul Sharma', email: 'rahul@gmail.com', lat: 12.9141, lng: 77.6100, loc: 'BTM Layout' }
        ];

        consumers.forEach(c => {
            db.run(`INSERT INTO users (name, email, password_hash, role, location_lat, location_lng, location_text, kyc_status) 
              VALUES (?, ?, ?, 'consumer', ?, ?, ?, 'verified')`,
                [c.name, c.email, passwordHash, c.lat, c.lng, c.loc]);
        });

        // Create Admin
        db.run(`INSERT INTO users (name, email, password_hash, role, location_lat, location_lng, location_text, kyc_status) 
            VALUES ('Admin User', 'admin@agriconnect.com', ?, 'admin', 0, 0, 'HQ', 'verified')`,
            [passwordHash]);

        // Create Products
        db.all('SELECT id, name FROM users WHERE role = "farmer"', (err, rows) => {
            if (err) { console.error(err); return; }

            const crops = [
                { name: 'Organic Tomatoes', price: 40, qty: 100, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=60' },
                { name: 'Fresh Carrots', price: 60, qty: 50, img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=60' },
                { name: 'Potatoes', price: 30, qty: 200, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=60' },
                { name: 'Spinach', price: 20, qty: 30, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=60' },
                { name: 'Onions', price: 50, qty: 150, img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=60' }
            ];

            rows.forEach(farmer => {
                // Add 3 random products for each farmer
                for (let i = 0; i < 3; i++) {
                    const crop = crops[Math.floor(Math.random() * crops.length)];
                    const harvestDate = new Date();
                    harvestDate.setDate(harvestDate.getDate() - Math.floor(Math.random() * 5)); // 0-5 days ago

                    db.run(`INSERT INTO products (farmer_id, crop_name, price_per_kg, available_qty, harvest_date, description, image_url)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [farmer.id, crop.name, crop.price, crop.qty, harvestDate.toISOString().split('T')[0], `Freshly harvested ${crop.name} from ${farmer.name}'s farm.`, crop.img]);
                }
            });

            console.log('Database seeded successfully!');
        });
    });
};

seed();
