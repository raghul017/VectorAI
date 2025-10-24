import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "../routes/aiRoutes.js";
import connectCloudinary from "../configs/cloudinary.js";
import userRouter from "../routes/userRoutes.js";
import sql from "../configs/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

app.get("/", (req, res) => res.send("Welcome to the server!"));

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await sql`SELECT 1 as test`;
    res.json({ success: true, message: "Database connected", data: result });
  } catch (error) {
    console.error("Database test error:", error);
    res.json({ success: false, message: error.message });
  }
});

// Test AI connection
app.get("/test-ai", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: false,
        message: "GEMINI_API_KEY not configured",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent("Say hello");
    const content = result.response.text();
    res.json({ success: true, message: "AI connected", response: content });
  } catch (error) {
    console.error("AI test error:", error);
    res.json({ success: false, message: error.message });
  }
});

// Environment check endpoint (for debugging)
app.get("/test-env", (req, res) => {
  const requiredEnvs = [
    "DATABASE_URL",
    "CLERK_SECRET_KEY",
    "CLERK_PUBLISHABLE_KEY",
    "GEMINI_API_KEY",
    "HUGGINGFACE_API_KEY",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const missing = requiredEnvs.filter((env) => !process.env[env]);
  const present = requiredEnvs.filter((env) => process.env[env]);

  res.json({
    status:
      missing.length === 0
        ? "All environment variables configured"
        : "Missing environment variables",
    present: present.length,
    missing: missing,
    nodeEnv: process.env.NODE_ENV,
  });
});

// Apply auth middleware only to protected routes
app.use("/api/ai", requireAuth(), aiRouter);
app.use("/api/user", requireAuth(), userRouter);

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Export Express app for Vercel
export default app;
