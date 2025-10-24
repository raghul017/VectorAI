// Minimal serverless function to test basic functionality
export default function handler(req, res) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);

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

    if (req.url === "/") {
      res.status(200).json({
        success: true,
        message: "Minimal server is working!",
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
      });
      return;
    }

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
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Default 404
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.url} not found`,
      availableRoutes: ["/", "/test-env"],
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
