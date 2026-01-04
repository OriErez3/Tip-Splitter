const express = require("express");
const User = require("../models/user.js");
const Receipt = require("../models/receipt.js");
const auth = require("../middleware/authMiddleware.js");

const router = express.Router();
console.log("✅ receiptRoute.js loaded");

router.post("/", auth, async (req, res) => {
    try {
        const receiptData = req.body;

        const receipt = await Receipt.create({
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

router.put("/:id", auth, async (req,res) =>{
  try{
  const receiptID = req.params.id;
  const receiptData = req.body;

  const receipt = await Receipt.findById(receiptID);

  if (!receipt){
    return res.status(404).json({ message: "Receipt not found" });
  }

  if (receipt.ownerID.toString() !== req.user.id){
      return res.status(403).json({ message: "Not authorized to edit this."})
    }
  const updatedReceipt = await Receipt.findByIdAndUpdate(
    receiptID,
    receiptData,
  { new: true, runValidators: true }
);

res.json(updatedReceipt);
} catch (err) {
  res.status(500).json({ message: "Couldn't edit receipt.", err});
}


});

router.delete("/:id", auth, async (req,res) =>{
  try {
    const receiptID = req.params.id;

    const receipt = await Receipt.findById(receiptID);

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" })
    }

    if (receipt.ownerID.toString() !== req.user.id){
      return res.status(403).json({ message: "Not authorized to delete this."})
    }
    await Receipt.findByIdAndDelete(receiptID);

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { receipts: receiptID }
    });

    res.json({ message: "Receipt deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete receipt", err });
  }
});

router.get("/mine", auth, async (req, res) => {
  try {
    const receipts = await Receipt.find({ ownerID: req.user.id })
      .sort({ date: -1 });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch receipts", err });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const receiptID = req.params.id;
    const receipt = await Receipt.findById(receiptID);

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    if (receipt.ownerID.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this receipt" });
    }

    res.json(receipt);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch receipt", err });
  }
});

router.get("/ping", (req, res) => res.json({ ok: true }));

module.exports = router; 
