const express = require("express");
const User = require("../models/user.js");
const Recipt = require("../models/receipt.js");
const auth = require("../middleware/authMiddleware.js");

const router = express.Router();
console.log("✅ receiptRoute.js loaded");

router.post("/", auth, async (req, res) => {
    try {
        const receiptData = req.body;

        const receipt = await Recipt.create({
            ...receiptData,
            ownerID: req.user.id,
        });

        await User.findByIdAndUpdate(req.user.id, {
            $push: { receipts: receipt._id }, 
        });
        return res.status(201).json(receipt);
    } catch(err) {
        return res.status(500).json({ message: "Failed to create receipt", err });
    }
});

router.get("/mine", auth, async (req, res) => {
  try {
    const receipts = await Recipt.find({ ownerID: req.user.id })
      .sort({ date: -1 });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch receipts", err });
  }
});

router.get("/ping", (req, res) => res.json({ ok: true }));

module.exports = router; 
