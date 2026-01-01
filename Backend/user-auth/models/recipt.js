const mongoose = require("mongoose");

const ReciptSchema = new mongoose.Schema({
    ownerID: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    particpants: {
        type: Array,
        required: true
    },
    items: {
        type: Array,
        required: false
    },
    subTotal: {
        type: Double,
        required: true
    },
    tax: {
        type: Double,
        required: true
    },
    tip: {
        type: Double,
        required: true
    },


})