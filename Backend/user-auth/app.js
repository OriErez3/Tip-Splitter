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

const PORT = process.env.PORT || 3030; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));