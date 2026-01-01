const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mealSubtotal: {
        type: Number,
        required: true
    },
    includeApps: {
        type: Boolean,
        default: true
    },

})

module.exports = ParticipantSchema;