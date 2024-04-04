const mongoose = require("mongoose")
const schema = mongoose.Schema

const rideShareSchema = new schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    pickupLocation: {
        type: String
    },
    whereTo: {
        type: String
    },
    noOfMales: {
        type: Number
    },
    noOfFemale: {
        type: Number
    }, 
    userName: { 
        type: String
    }

})

const packageTransportSchema = new schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    pickupLocation: {
        type: String
    },
    transportTo: {
        type: String
    },
    noOfItems: {
        type: Number
    },
    totalWeight: {
        type: String
    },
    userName: { 
        type: String
    }


})

const gemochFinderSchema = new schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    userName: { 
        type: String
    }

})


const adviceSchema = new schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    userName: {
        type: String
    }

})


const categoriesSchema = new schema({
    rideShare: [rideShareSchema],
    packageTransport: [packageTransportSchema],
    gemochFinder: [gemochFinderSchema],
    advice: [adviceSchema]
});

const categoriesModel = mongoose.model('Category', categoriesSchema);
module.exports = categoriesModel;
