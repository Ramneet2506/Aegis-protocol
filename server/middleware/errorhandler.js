/**
 * Global error handling middleware
 * Should be last middleware in the Express app
 */
const errorHandler = (err, req, res, next) => {
    // Set default error status and message
    let status = err.status || err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose validation error
    if (err.name === "ValidationError") {
        status = 400;
        message = Object.values(err.errors)
            .map((err) => err.message)
            .join(", ");
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        status = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === "CastError") {
        status = 400;
        message = "Invalid ID format";
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        status = 401;
        message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
        status = 401;
        message = "Token has expired";
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }

    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { error: err }),
    });
};

module.exports = errorHandler;
