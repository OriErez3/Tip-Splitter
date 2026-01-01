const mongoose = require("mongoose");
const ParticipantSchema = require("./participant");

const ReciptSchema = new mongoose.Schema({
    ownerID: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    participants: {
        type: [ParticipantSchema],
        required: true
    },
    appetizerSubtotal: {
        type: Number,
        default: 0 
    },
    subTotal: {
        type: Number,
        required: false
    },
    tax: {
        type: Number,
        required: true
    },
    tip: {
        type: Number,
        required: true
    },


})
module.exports = mongoose.model('Recipt', ReciptSchema); 