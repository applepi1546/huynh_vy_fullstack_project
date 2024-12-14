const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const tripModel = mongoose.model('trips');
const userModel = mongoose.model('users');

// GET: /trips - return list of all trips
const tripList = async (req, res) => {
    try {
        // Await the promise returned by find() to get trips
        const trips = await tripModel.find({});

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: 'Trips not found' });
        }

        // Send the trips as the response if found
        return res.status(200).json(trips);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error while fetching trips' });
    }
};

// GET: /trips/:tripCode - return a single trip
const tripsFindCode = async (req, res) => {

    try {
        const trip = await tripModel.find({ code: req.params.tripCode });

        if (!trip || trip.length === 0) {
            return res
                .status(404)
                .json({ message: 'Trip not found with code ' + req.params.tripCode });
        }

        return res
            .status(200)
            .json(trip);
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Error retrieving trip', error: err });
    }
};

// POST: /trips - add a new trip
const tripsAddTrip = async (req, res) => {

    try {
        // Get the user
        await getUser(req, res, async (req, res) => {
            try {
                // Create a new trip
                const trip = await tripModel.create({
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description,
                });

                return res.status(201).json(trip); // Created successfully
            } catch (err) {
                console.error(err);
                return res.status(400).json(err); // Bad request if error occurs
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error fetching user", error: err });
    }
};

// PUT: /trips/:tripCode - update a single trip
const tripsUpdateTrip = async (req, res) => {
    try {
        await getUser(req, res, async (req, res) => {
            try {
                const updatedTrip = await tripModel.findOneAndUpdate(
                    { code: req.params.tripCode },
                    {
                        code: req.body.code,
                        name: req.body.name,
                        length: req.body.length,
                        start: req.body.start,
                        resort: req.body.resort,
                        perPerson: req.body.perPerson,
                        image: req.body.image,
                        description: req.body.description
                    },
                );

                if (!updatedTrip) {
                    return res.status(404).json({ message: 'Trip not found with code ' + req.params.tripCode });
                }

                return res.status(200).json(updatedTrip);

            } catch (err) {
                console.error(err);
                return res.status(400).json({ message: "Error updating trip", error: err });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error fetching user", error: err });
    }
};

// DELETE: /trips/:tripCode - delete a single trip
const tripsDeleteTrip = async (req, res) => {
    console.log('TravelController#tripsDeleteTrip', req.body);
    await getUser(req, res, (req, res) => {
        tripModel
            .findOneAndRemove({
                code: req.params.tripCode
            })
            .then((trip) => {
                if (!trip) {
                    return res
                        .status(404)
                        .send({message: 'trip not found with code ' + req.params.tripCode});
                }
                res
                    .status(200)
                    .send({message: `trip ${req.params.tripCode} successfully deleted!`});
            })
            .catch((err) => {
                if (err.kind === 'ObjectId') {
                    return res

                        .status(404)
                        .send({message: 'trip not found with code ' + req.params.tripCode});
                }
                return res
                    .status(500) // server error
                    .json(err);
            });
    });
};

const getUser = async (req, res, callback) => {
    if (req.auth && req.auth.email) {
        try {
            // Using await to find the user by email
            const user = await userModel.findOne({ email: req.auth.email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Call the callback with the user name if user is found
            callback(req, res, user.name);
        } catch (err) {
            console.log(err);
            return res.status(404).json(err);
        }
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    tripList,
    tripsFindCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};