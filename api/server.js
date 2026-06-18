const express = require("express");
const cors = require("cors");

const userRoutes = require("./src/routes/userRoutes");
const invoiceRoutes = require("./src/routes/invoiceRoutes");

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({ origin: "*" }));

// JSON parser
app.use(express.json());

// Health check endpoint
app.get("/endpoint", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/invoices", invoiceRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});