

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import middleware
const errorHandler = require("./middleware/errorhandler");

// Import routes
const authRoutes = require("./routes/authroutes");
const grievanceRoutes = require("./routes/grievanceroutes");
const courseRoutes = require("./routes/courseroutes");
const opportunityRoutes = require("./routes/opportunityroutes");
const adminRoutes = require("./routes/adminroutes");
const announcementRoutes = require("./routes/announcementroutes");
const assignmentRoutes = require("./routes/assignmentroutes");
const app = express();

// ============ SECURITY MIDDLEWARE ============

// Helmet - Set security HTTP headers
app.use(helmet());

// CORS - Restrict to specific origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // stricter limit for auth endpoints
  message: "Too many login attempts, please try again later",
});

if (process.env.NODE_ENV === "production") {
  app.use(limiter);
} // Apply general limiter to all requests

// Body parser middleware
app.use(express.json());
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL injection


// ============ API ROUTES ============

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/grievances", grievanceRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/opportunities", opportunityRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/announcements", announcementRoutes);
app.use("/api/v1/assignments", assignmentRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("AEGIS Protocol Backend Running 🚀");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
app.use("/uploads", express.static("uploads"));
// ============ ERROR HANDLING ============
// Global error handler (must be last)
app.use(errorHandler);

// ============ DATABASE CONNECTION ============
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => {
  console.error("MongoDB Connection Error:", err);
  process.exit(1);
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});