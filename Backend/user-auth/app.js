const express = require("express");
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth")
const reciptRouter = require("./routes/reciptRoute")

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes)
app.use('/api/recipts', reciptRouter)

const PORT = process.env.PORT || 3030; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));