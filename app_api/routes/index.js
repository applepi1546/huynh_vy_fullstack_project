const express = require('express'); // Express app
const router = express.Router(); // Router logic

// Location to import controllers that we route

const tripsController = require('../controllers/trips');

// Define route for our trips endpoint

router
    .route('/trips')
    .get(tripsController.tripsList) // GET method routes tripsList
    .post(tripsController.tripsAddTrip); // POST method adds a trip

router
    .route('/trips/:tripsCode')
    .get(tripsController.tripsFindByCode)
    .put(tripsController.tripsUpdateTrip)


module.exports = router;