import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import aiRouter from "../routes/aiRoutes.js";
import connectCloudinary from "../configs/cloudinary.js";
import userRouter from "../routes/userRoutes.js";

const app = express();

// Initialize Cloudinary (non-blocking for serverless)
connectCloudinary().catch((err) =>
  console.error("Cloudinary init error:", err)
);

// Enable Cross-Origin Resource Sharing (CORS) for the application
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Increase payload size limits for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("🚀 VectorAI API Server v1.1 - Running Successfully!"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    version: "1.1.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
    uptime: process.uptime(),
  });
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const sql = await import("../configs/db.js");
    const result = await sql.default`SELECT 1 as test`;
    res.json({ success: true, message: "Database connected", data: result });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Test AI connection
app.get("/test-ai", async (req, res) => {
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent("Say hello");
    const content = result.response.text();
    res.json({ success: true, message: "AI connected", response: content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Test POST endpoint without auth
app.post("/test-post", (req, res) => {
  res.json({ success: true, message: "POST request works!", data: req.body });
});

// Mount routers - auth is handled by individual route middleware
app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

// 404 handler - must come BEFORE error handler
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

// Error handling middleware - must be LAST
app.use((err, req, res, next) => {
  console.error("=== SERVER ERROR ===");
  console.error("Path:", req.path);
  console.error("Method:", req.method);
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Export Express app for Vercel serverless
export default app;
