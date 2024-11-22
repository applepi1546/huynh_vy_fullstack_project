const mongoose = require('mongoose');
const Trip = require ('../models/travlr'); //Register Model
const Model = mongoose.model('trips');


const tripsList = async(req, res) => {
    const q = await Model
        .find({}) // No filter, return all records
        .exec();

    // Uncomment the following line to show result of query on console
    // console.log(q);

    if(!q)
    { // Database returned no data
        return res
            .status(404)
            .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

const tripsFindByCode = async(req, res) => {
    const q = await Model
        .findOne({ code: req.params.tripCode }) // Filter by trip code
        .exec();

    // Uncomment the following line to show result of query on console
    // console.log(q);

    if(!q)
    { // Database returned no data
        return res
            .status(404)
            .json(err);
    } else { // Return resulting trip
        return res
            .status(200)
            .json(q);
    }
}
module.exports = {
    tripsList,
    tripsFindByCode
};