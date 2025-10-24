import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

console.log("Starting server initialization...");

// Basic health check route (no dependencies)
app.get("/", (req, res) => {
  console.log("Root route hit");
  res.json({
    success: true,
    message: "Welcome to the server!",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// Environment check (minimal dependencies)
app.get("/test-env", (req, res) => {
  console.log("Environment check route hit");
  try {
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
      success: true,
      status:
        missing.length === 0
          ? "All environment variables configured"
          : "Missing environment variables",
      present: present.length,
      missing: missing,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Environment check error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

let clerkMiddleware, requireAuth, sql, GoogleGenerativeAI, connectCloudinary;
let aiRouter, userRouter;
let initialized = false;

// Lazy initialization function
async function initializeServices() {
  if (initialized) return;

  try {
    console.log("Initializing services...");

    // Load Clerk
    const clerkModule = await import("@clerk/express");
    clerkMiddleware = clerkModule.clerkMiddleware;
    requireAuth = clerkModule.requireAuth;
    console.log("Clerk loaded");

    // Load database
    const dbModule = await import("../configs/db.js");
    sql = dbModule.default;
    console.log("Database loaded");

    // Load AI
    const aiModule = await import("@google/generative-ai");
    GoogleGenerativeAI = aiModule.GoogleGenerativeAI;
    console.log("AI loaded");

    // Load Cloudinary
    const cloudinaryModule = await import("../configs/cloudinary.js");
    connectCloudinary = cloudinaryModule.default;
    await connectCloudinary().catch(console.error);
    console.log("Cloudinary loaded");

    // Load routes
    const aiRouterModule = await import("../routes/aiRoutes.js");
    aiRouter = aiRouterModule.default;

    const userRouterModule = await import("../routes/userRoutes.js");
    userRouter = userRouterModule.default;
    console.log("Routes loaded");

    initialized = true;
    console.log("All services initialized successfully");
  } catch (error) {
    console.error("Service initialization error:", error);
    throw error;
  }
}

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Middleware to initialize services on demand
app.use(async (req, res, next) => {
  // Skip initialization for basic routes
  if (req.path === "/" || req.path === "/test-env") {
    return next();
  }

  try {
    await initializeServices();
    if (clerkMiddleware) {
      clerkMiddleware()(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    console.error("Middleware initialization error:", error);
    res
      .status(500)
      .json({ success: false, error: "Service initialization failed" });
  }
});

// Test database connection (requires initialization)
app.get("/test-db", async (req, res) => {
  try {
    await initializeServices();
    const result = await sql`SELECT 1 as test`;
    res.json({ success: true, message: "Database connected", data: result });
  } catch (error) {
    console.error("Database test error:", error);
    res.json({ success: false, message: error.message });
  }
});

// Test AI connection (requires initialization)
app.get("/test-ai", async (req, res) => {
  try {
    await initializeServices();

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

// Protected routes - initialize services when accessed
app.use("/api/ai", async (req, res, next) => {
  try {
    await initializeServices();
    if (requireAuth && aiRouter) {
      requireAuth()(req, res, (err) => {
        if (err) return next(err);
        aiRouter(req, res, next);
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Services not initialized" });
    }
  } catch (error) {
    console.error("AI route initialization error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to initialize AI services" });
  }
});

app.use("/api/user", async (req, res, next) => {
  try {
    await initializeServices();
    if (requireAuth && userRouter) {
      requireAuth()(req, res, (err) => {
        if (err) return next(err);
        userRouter(req, res, next);
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Services not initialized" });
    }
  } catch (error) {
    console.error("User route initialization error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to initialize user services" });
  }
});

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
