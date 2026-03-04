const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
const authRoutes = require("./routes/authroutes");
const grievanceRoutes = require("./routes/grievanceroutes");
const courseRoutes = require("./routes/courseroutes");
const opportunityRoutes = require("./routes/opportunityroutes");
const adminRoutes = require("./routes/adminroutes");
const announcementRoutes = require("./routes/announcementroutes");
require("dotenv").config();



// Middleware

app.use("/api/auth", authRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
// Test Route
app.get("/", (req, res) => {
    res.send("AEGIS Protocol Backend Running 🚀");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});