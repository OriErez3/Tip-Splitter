const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require('../models/user')
const router = express.Router();

router.post('/register', async (req, res) =>{
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password){
            return res.status(400).json({ message: 'All fields required' });

        }
        const userExists = await User.findOne({ email });
        if (userExists){
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({ username, email, password });
        res.status(201).json({ message: 'User succesfully created', user: newUser});
    } catch (err) {
  console.error("REGISTER ERROR:", err);
  console.error(err?.stack);
  return res.status(500).json({ message: err.message });
}
});




router.post('/login', async (req, res) =>{
    const { email,  password } = req.body;

    try {
        const user = await User.findOne({ email })
        if (!user){
            return res.status(400).json({message: 'No user with that email found'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({message: 'Wrong password'});
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.json({ message: 'Login successful', token});
    } catch (err){
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 
