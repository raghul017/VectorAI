import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
await connectCloudinary();

// CORS configuration for cross-origin requests
const corsOptions = {
  origin: true, // Allow all origins (or specify: ['https://vectorai-client.vercel.app'])
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Welcome to the server!"));

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const sql = await import("./configs/db.js");
    const result = await sql.default`SELECT 1 as test`;
    res.json({ success: true, message: "Database connected", data: result });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Test AI connection (Groq + Gemini)
app.get("/test-ai", async (req, res) => {
  const results = { groq: null, gemini: null };
  
  // Test Groq
  try {
    const Groq = (await import("groq-sdk")).default;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Say hello" }],
      max_tokens: 50
    });
    results.groq = { success: true, response: response.choices[0]?.message?.content };
  } catch (err) {
    results.groq = { success: false, error: err.message };
  }
  
  // Test Gemini
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say hello");
    results.gemini = { success: true, response: result.response.text() };
  } catch (err) {
    results.gemini = { success: false, error: err.message };
  }
  
  res.json({ success: results.groq?.success || results.gemini?.success, results });
});

// Apply auth middleware only to protected routes
app.use("/api/ai", requireAuth(), aiRouter);
app.use("/api/user", requireAuth(), userRouter);

// Start server (works for both local dev and Render deployment)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export for testing
export default app;

