module.exports = async (req, res) => {
    // Enable CORS manually
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Content-Type, Authorization, Accept'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // DUMMY RESPONSE - NO DB
    console.log("Register Function Hit! Returning Dummy Success.");

    // Simulating a successful user creation for ID 999
    res.status(201).json({
        message: 'User registered successfully (DUMMY)',
        token: 'dummy_token_12345',
        user: {
            id: 999,
            name: 'Test Farmer',
            email: 'test@farm.com',
            role: 'farmer',
            kyc_status: 'verified'
        }
    });
};
