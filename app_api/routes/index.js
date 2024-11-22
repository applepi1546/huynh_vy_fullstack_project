const express = require('express'); // Express app
const router = express.Router(); // Router logic

// Import trips controller
const tripsController = require('../controllers/trips');

// define route for our trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList); // GET method routes tripsList

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode); // GET method routes tripsFindByCode

module.exports = router;