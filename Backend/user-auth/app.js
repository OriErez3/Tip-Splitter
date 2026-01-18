const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth")
const receiptRouter = require("./routes/receiptRoute")

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes)
app.use('/api/receipts', receiptRouter)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err);
  console.error(err?.stack);
  res.status(500).json({ message: err.message || "Server error" });
});
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  console.error(err.stack);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

const PORT = process.env.PORT || 3030; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));