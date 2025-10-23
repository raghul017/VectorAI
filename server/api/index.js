import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "../routes/aiRoutes.js";
import connectCloudinary from "../configs/cloudinary.js";
import userRouter from "../routes/userRoutes.js";

const app = express();

// Initialize Cloudinary (non-blocking for serverless)
connectCloudinary().catch(console.error);

// Enable Cross-Origin Resource Sharing (CORS) for the application
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("API Server is running! ✅"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
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

// Apply auth middleware only to protected routes
app.use("/api/ai", requireAuth(), aiRouter);
app.use("/api/user", requireAuth(), userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Export Express app for Vercel serverless
export default app;
