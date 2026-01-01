const express = require("express");
const User = require("../models/user.js");
const Recipt = require("../models/recipt.js");
const auth = require("../middleware/authMiddleware.js");

const router = express.Router();
console.log("✅ reciptRoute.js loaded");

router.post("/", auth, async (req, res) => {
    try {
        const reciptData = req.body;

        const recipt = await Recipt.create({
            ...reciptData,
            ownerID: req.user.id,
        });

        await User.findByIdAndUpdate(req.user.id, {
            $push: { recipts: recipt._id }, 
        });
        return res.status(201).json(recipt);
    } catch(err) {
        return res.status(500).json({ message: "Failed to create receipt", err });
    }
});

router.get("/mine", auth, async (req, res) => {
  try {
    const recipts = await Recipt.find({ ownerID: req.user.id })
      .sort({ date: -1 });
    res.json(recipts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch receipts", err });
  }
});

router.get("/ping", (req, res) => res.json({ ok: true }));

module.exports = router; 
