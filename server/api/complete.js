// Complete but minimal serverless API for Vector.AI

// Lazy initialization variables
let sql, genAI, cloudinary;
let initialized = false;

// Initialize services only when needed
async function initializeServices() {
  if (initialized) return;

  try {
    console.log("Initializing services...");

    if (!sql && process.env.DATABASE_URL) {
      const { neon } = await import("@neondatabase/serverless");
      sql = neon(process.env.DATABASE_URL);
      console.log("Database initialized");
    }

    if (!genAI && process.env.GEMINI_API_KEY) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log("AI initialized");
    }

    if (!cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
      const cloudinaryModule = await import("cloudinary");
      cloudinary = cloudinaryModule.v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      console.log("Cloudinary initialized");
    }

    initialized = true;
    console.log("All services initialized successfully");
  } catch (error) {
    console.error("Service initialization error:", error);
    throw error;
  }
}

// Helper function to parse JSON body
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    let timeoutId;

    // Set a timeout for body parsing
    timeoutId = setTimeout(() => {
      console.log("Body parsing timeout");
      resolve({});
    }, 10000); // 10 second timeout

    req.on("data", (chunk) => {
      console.log("Receiving chunk:", chunk.length, "bytes");
      body += chunk.toString();
    });

    req.on("end", () => {
      clearTimeout(timeoutId);
      console.log("Raw body received:", body);
      console.log("Body length:", body.length);
      console.log("Content-Type:", req.headers["content-type"]);
      console.log("Content-Length:", req.headers["content-length"]);

      if (!body || body.trim() === "") {
        console.log("Empty or whitespace-only body received");
        resolve({});
        return;
      }

      try {
        const parsed = JSON.parse(body);
        console.log("Parsed body successfully:", parsed);
        resolve(parsed);
      } catch (error) {
        console.error("JSON parse error:", error.message);
        console.error("Attempted to parse:", JSON.stringify(body));
        resolve({});
      }
    });

    req.on("error", (error) => {
      clearTimeout(timeoutId);
      console.error("Request stream error:", error);
      resolve({});
    });

    req.on("close", () => {
      clearTimeout(timeoutId);
      console.log("Request stream closed");
    });
  });
}

// Helper function to verify Clerk auth
async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No auth token provided");
  }

  // For now, just check if token exists - you can add Clerk verification later
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Invalid auth token");
  }

  return { userId: "user_temp" }; // Return a temporary user ID
}

export default async function handler(req, res) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Has body stream:", !!req.readable);

  try {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    // Health check
    if (req.url === "/") {
      res.status(200).json({
        success: true,
        message: "Vector.AI API Server",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: [
          "GET /",
          "GET /test-env",
          "GET /test-db",
          "GET /test-ai",
          "POST /api/ai/generate-article",
          "POST /api/ai/generate-blog-title",
          "POST /api/ai/generate-images",
          "GET /api/ai/image-usage",
          "GET /api/user/creations",
          "GET /api/user/get-user-creations",
          "GET /api/user/public-creations",
        ],
      });
      return;
    }

    // Environment check
    if (req.url === "/test-env") {
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

      res.status(200).json({
        success: true,
        status:
          missing.length === 0
            ? "All environment variables configured"
            : "Missing environment variables",
        present: present.length,
        missing: missing,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
      });
      return;
    }

    // Database test
    if (req.url === "/test-db") {
      try {
        await initializeServices();
        if (!sql) {
          throw new Error("Database not configured - missing DATABASE_URL");
        }
        const result = await sql`SELECT 1 as test, NOW() as timestamp`;
        res.status(200).json({
          success: true,
          message: "Database connected successfully",
          data: result[0],
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Database connection failed",
          error: error.message,
        });
      }
      return;
    }

    // AI test
    if (req.url === "/test-ai") {
      try {
        await initializeServices();
        if (!genAI) {
          res.status(500).json({
            success: false,
            message: "GEMINI_API_KEY not configured",
          });
          return;
        }

        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp",
        });
        const result = await model.generateContent("Say hello");
        const content = result.response.text();

        res.status(200).json({
          success: true,
          message: "AI connected successfully",
          response: content,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "AI connection failed",
          error: error.message,
        });
      }
      return;
    }

    // Generate Article
    if (req.url === "/api/ai/generate-article" && req.method === "POST") {
      try {
        await initializeServices();
        await verifyAuth(req);
        const body = await parseBody(req);
        console.log("Received body:", body);

        const { topic, wordCount = 800 } = body;

        if (!topic) {
          res.status(400).json({
            success: false,
            message: "Topic is required",
            receivedBody: body,
            debug: {
              hasBody: !!body,
              bodyKeys: Object.keys(body || {}),
              contentType: req.headers["content-type"],
            },
          });
          return;
        }

        const prompt = `Write a comprehensive, engaging article about "${topic}". 
        Target length: ${wordCount} words. 
        Include proper headings, subheadings, and make it informative and well-structured.`;

        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp",
        });
        const result = await model.generateContent(prompt);
        const content = result.response.text();

        res.status(200).json({
          success: true,
          article: content,
          wordCount: content.split(" ").length,
          topic,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to generate article",
          error: error.message,
        });
      }
      return;
    }

    // Generate Blog Title
    if (req.url === "/api/ai/generate-blog-title" && req.method === "POST") {
      try {
        await initializeServices();
        await verifyAuth(req);
        const { topic, category = "general" } = await parseBody(req);

        if (!topic) {
          res
            .status(400)
            .json({ success: false, message: "Topic is required" });
          return;
        }

        const prompt = `Generate 5 catchy, SEO-optimized blog titles for the topic "${topic}" in the ${category} category. 
        Make them engaging, clickable, and under 60 characters each.`;

        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp",
        });
        const result = await model.generateContent(prompt);
        const content = result.response.text();

        // Parse titles from response
        const titles = content
          .split("\\n")
          .filter((line) => line.trim())
          .slice(0, 5);

        res.status(200).json({
          success: true,
          titles,
          topic,
          category,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to generate blog titles",
          error: error.message,
        });
      }
      return;
    }

    // Generate Images (Hugging Face FLUX.1-schnell)
    if (req.url === "/api/ai/generate-images" && req.method === "POST") {
      try {
        await initializeServices();
        await verifyAuth(req);
        const { prompt, style = "realistic" } = await parseBody(req);

        if (!prompt) {
          res
            .status(400)
            .json({ success: false, message: "Prompt is required" });
          return;
        }

        // Call Hugging Face API
        const response = await fetch(
          "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: `${prompt}, ${style} style, high quality, detailed`,
              parameters: {
                num_inference_steps: 4,
                guidance_scale: 0.0,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Hugging Face API error: ${response.status}`);
        }

        const imageBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString("base64");

        // Upload to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(
          `data:image/png;base64,${base64Image}`,
          {
            folder: "vectorai-generations",
            resource_type: "image",
          }
        );

        res.status(200).json({
          success: true,
          imageUrl: cloudinaryResponse.secure_url,
          prompt,
          style,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to generate image",
          error: error.message,
        });
      }
      return;
    }

    // Image Usage (placeholder)
    if (req.url === "/api/ai/image-usage" && req.method === "GET") {
      try {
        await verifyAuth(req);
        res.status(200).json({
          success: true,
          usage: {
            used: 5,
            limit: 15,
            remaining: 10,
            resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to get usage",
          error: error.message,
        });
      }
      return;
    }

    // User Creations - Original route
    if (req.url === "/api/user/creations" && req.method === "GET") {
      try {
        await verifyAuth(req);
        res.status(200).json({
          success: true,
          creations: [],
          message: "No creations found",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to get creations",
          error: error.message,
        });
      }
      return;
    }

    // User Creations - Frontend expects this route
    if (req.url === "/api/user/get-user-creations" && req.method === "GET") {
      try {
        await verifyAuth(req);
        res.status(200).json({
          success: true,
          creations: [],
          message: "No user creations found",
        });
      } catch (error) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
          error: error.message,
        });
      }
      return;
    }

    // Public Creations (placeholder)
    if (req.url === "/api/user/public-creations" && req.method === "GET") {
      res.status(200).json({
        success: true,
        creations: [],
        message: "No public creations found",
      });
      return;
    }

    // 404 for unknown routes
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.url} not found`,
      availableRoutes: [
        "GET /",
        "GET /test-env",
        "GET /test-db",
        "GET /test-ai",
        "POST /api/ai/generate-article",
        "POST /api/ai/generate-blog-title",
        "POST /api/ai/generate-images",
        "GET /api/ai/image-usage",
        "GET /api/user/creations",
        "GET /api/user/get-user-creations",
        "GET /api/user/public-creations",
      ],
    });
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
