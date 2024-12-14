const express = require('express');
const router = express.Router();
const {expressjwt: jwt} = require('express-jwt');

const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload",
    algorithms: ["HS256"],
});

const authController = require('../controllers/authentication');
const travelController = require('../controllers/trips');

// API routes
// Route to authenticate a user
router
    .route('/login')
    .post(authController.login);

// Route to register a new user
router
    .route('/register')
    .post(authController.register);


// Route to get a list of all trips
router
    .route('/trips')
    .get(travelController.tripList)
    .post(auth, travelController.tripsAddTrip);

// Route to find and return a single trip by trip code
router
    .route('/trips/:tripCode')
    .get(travelController.tripsFindCode)
    .put(auth, travelController.tripsUpdateTrip)
    .delete(auth, travelController.tripsDeleteTrip);

module.exports = router;