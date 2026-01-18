const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    receipts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Recipt" }
    ],
        
    
});

UserSchema.pre('save', async function (next){
    try{
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
    return next()
    } catch(err){
        return next(err);
    }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);