const app = require('../index'); // Import the main express app

// Wrapper to ensure request/response are handled correctly
module.exports = (req, res) => {
    return app(req, res);
};
