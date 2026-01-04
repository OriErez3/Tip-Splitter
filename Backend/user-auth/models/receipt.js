const mongoose = require("mongoose");
const ParticipantSchema = require("./participant");

const ReciptSchema = new mongoose.Schema({
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
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
        // Stored as decimal percentage (e.g., 0.08875 for 8.875%)
    },
    tip: {
        type: Number,
        required: true
        // Stored as decimal percentage (e.g., 0.20 for 20%)
    },
},
    { timestamps: true }
)
module.exports = mongoose.models.Recipt || mongoose.model('Recipt', ReciptSchema);