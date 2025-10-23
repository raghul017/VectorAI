import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";

const app = express();

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

app.get("/", (req, res) =>
  res.send("🚀 VectorAI API Server v1.2 - Running Successfully!")
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    version: "1.2.0",
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
    res.json({ success: false, message: error.message, stack: error.stack });
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

// Lazy load routes to catch import errors
app.use("/api/ai", async (req, res, next) => {
  try {
    const { default: aiRouter } = await import("../routes/aiRoutes.js");
    aiRouter(req, res, next);
  } catch (error) {
    console.error("Error loading AI routes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load AI routes: " + error.message,
    });
  }
});

app.use("/api/user", async (req, res, next) => {
  try {
    const { default: userRouter } = await import("../routes/userRoutes.js");
    userRouter(req, res, next);
  } catch (error) {
    console.error("Error loading user routes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load user routes: " + error.message,
    });
  }
});

// Initialize Cloudinary after routes
(async () => {
  try {
    const { default: connectCloudinary } = await import(
      "../configs/cloudinary.js"
    );
    await connectCloudinary();
    console.log("✅ Cloudinary connected");
  } catch (error) {
    console.error("⚠️ Cloudinary initialization failed:", error.message);
  }
})();

// 404 handler
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
