# 🔍 Vector.AI - Code Deep Dive & Explanation

Complete line-by-line explanation of key code files and architectural concepts.

---

## 📋 Table of Contents

1. [Backend Architecture](#backend-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Database Configuration](#database-configuration)
4. [Authentication Flow](#authentication-flow)
5. [API Controllers Deep Dive](#api-controllers-deep-dive)
6. [Frontend Components Deep Dive](#frontend-components-deep-dive)
7. [Common Patterns & Concepts](#common-patterns--concepts)

---

## 🏗️ Backend Architecture

### File: `server/server.js`

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/server.js start=1
import express from "express";           // Web framework
import cors from "cors";                 // Cross-Origin Resource Sharing
import "dotenv/config";                  // Load environment variables
import { clerkMiddleware, requireAuth } from "@clerk/express"; // Auth
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
await connectCloudinary();               // Initialize Cloudinary

// Enable CORS - allows requests from different domains
app.use(cors());
app.use(express.json());                 // Parse JSON request bodies
app.use(clerkMiddleware());              // Initialize Clerk auth

// Health check endpoint
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

// Apply auth middleware ONLY to protected routes
app.use("/api/ai", requireAuth(), aiRouter);      // AI routes protected
app.use("/api/user", requireAuth(), userRouter);  // User routes protected

// Export for Vercel serverless deployment
export default app;

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
```

**Key Concepts:**
- **Middleware chain**: Each request passes through cors → json → clerk → route handlers
- **requireAuth()**: Verifies JWT token before allowing access to protected routes
- **Export for Vercel**: The `export default app` allows Vercel to wrap the app as a serverless function
- **Local dev check**: Only starts server.listen() if NOT in production (Vercel runs it differently)

---

### File: `server/routes/aiRoutes.js`

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/routes/aiRoutes.js start=1
import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  resumeReview,
  getImageUsage,
} from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

// Text generation routes (POST with JSON body)
aiRouter.post("/generate-article", auth, generateArticle);
aiRouter.post("/generate-blog-title", auth, generateBlogTitle);

// Image generation (POST with JSON body)
aiRouter.post("/generate-images", auth, generateImage);

// Get daily image usage quota
aiRouter.get("/image-usage", auth, getImageUsage);

// File upload routes (POST with FormData)
// upload.single("image") - Multer middleware that parses file from "image" form field
aiRouter.post(
  "/remove-background",
  upload.single("image"),  // Parse image file
  auth,                     // Verify user
  removeImageBackground     // Handler
);

aiRouter.post(
  "/remove-image-object",
  upload.single("image"),
  auth,
  removeImageObject
);

aiRouter.post("/resume-review", upload.single("resume"), auth, resumeReview);

export default aiRouter;
```

**Route Pattern:**
```
File Upload Flow:
1. upload.single("file") - Multer saves temp file, adds req.file
2. auth - Verify user token
3. Controller - Process file and return result
```

```
JSON Body Flow:
1. Body parsed by express.json() in server.js
2. auth - Verify user token
3. Controller - Process data and return result
```

---

### File: `server/routes/userRoutes.js`

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/routes/userRoutes.js start=1
import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getPublishedCreations,
  getUserCreations,
  toggleLikeCreation,
  deleteCreation,
  clearAllCreations,
} from "../controllers/userController.js";

const userRouter = express.Router();

// GET - Fetch user's own creations
userRouter.get("/get-user-creations", auth, getUserCreations);

// GET - Fetch all published creations (community gallery)
userRouter.get("/get-published-creations", auth, getPublishedCreations);

// POST - Like or unlike a creation
userRouter.post("/toggle-like-creation", auth, toggleLikeCreation);

// DELETE - Delete specific creation by ID
// :id is a URL parameter (e.g., /delete-creation/123 → id="123")
userRouter.delete("/delete-creation/:id", auth, deleteCreation);

// DELETE - Clear all creations for user
userRouter.delete("/clear-all-creations", auth, clearAllCreations);

export default userRouter;
```

**REST Conventions:**
- `GET` = Retrieve data (no side effects)
- `POST` = Create or modify data
- `DELETE` = Remove data
- `:id` = URL parameter (accessed via `req.params.id`)

---

## 🔐 Database Configuration

### File: `server/configs/db.js`

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/configs/db.js start=1
import "dotenv/config";                    // Load environment variables
import { neon } from "@neondatabase/serverless";

// Create connection to Neon PostgreSQL
const sql = neon(process.env.DATABASE_URL);

export default sql;
```

**What's happening:**
1. `neon()` creates a connection to Neon PostgreSQL database
2. Connection string comes from `DATABASE_URL` env variable
3. Returns a function for executing SQL queries
4. Exported as default for use throughout the app

**Usage example:**
```javascript
// In controllers:
const result = await sql`SELECT * FROM creations WHERE user_id = ${userId}`;
// This is template literal syntax - ${userId} is escaped for SQL injection prevention
```

---

### File: `server/database_schema.sql`

```sql path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/database_schema.sql start=1
-- Create table for storing all AI-generated content
CREATE TABLE IF NOT EXISTS creations (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing ID
    user_id VARCHAR(255) NOT NULL,      -- Clerk user ID (string)
    prompt TEXT NOT NULL,               -- Original user request
    content TEXT NOT NULL,              -- Generated content or image URL
    type VARCHAR(50) NOT NULL,          -- 'article', 'blog', 'image', 'resume-review'
    publish BOOLEAN DEFAULT FALSE,      -- Whether shared to community
    likes TEXT[] DEFAULT '{}',          -- Array of user IDs who liked (stored as text)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_creations_user_id ON creations(user_id);
-- Why: Fetching user's creations is most frequent query
-- Example: SELECT * FROM creations WHERE user_id = '123'
-- Without index: O(n) - scans entire table
-- With index: O(log n) - B-tree lookup

CREATE INDEX IF NOT EXISTS idx_creations_publish ON creations(publish);
-- Why: Community gallery queries all published items
-- Example: SELECT * FROM creations WHERE publish = true

CREATE INDEX IF NOT EXISTS idx_creations_type ON creations(type);
-- Why: Filter by content type (articles vs images)
-- Example: SELECT COUNT(*) FROM creations WHERE type = 'image'

CREATE INDEX IF NOT EXISTS idx_creations_created_at ON creations(created_at);
-- Why: Sort by newest first (done everywhere)
-- Example: ORDER BY created_at DESC

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- When any row is updated, this trigger automatically sets updated_at to current time
CREATE TRIGGER update_creations_updated_at 
    BEFORE UPDATE ON creations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

**Likes Array Explanation:**
```sql
-- PostgreSQL TEXT[] (array type) stores: {'user1', 'user2', 'user3'}
-- In JavaScript, this becomes: ['user1', 'user2', 'user3']

-- To check if user liked:
SELECT likes FROM creations WHERE id = 1
-- Returns: {user123, user456}
-- Check in JS: array.includes(userId)

-- To add like:
UPDATE creations SET likes = '{user1,user2,user3}' WHERE id = 1

-- For 100K users, normalize to junction table (likes_table):
-- id | creation_id | user_id
-- 1  | 5          | user123
-- 2  | 5          | user456
-- This allows better query performance with large datasets
```

---

## 🔑 Authentication Flow

### File: `server/middlewares/auth.js`

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/middlewares/auth.js start=1
import { clerkClient } from "@clerk/express";

// Middleware function - runs before each protected route handler
export const auth = async (req, res, next) => {
  try {
    // req.auth() is provided by clerkMiddleware() in server.js
    // It validates the JWT token sent in Authorization header
    const { userId } = await req.auth();

    // If token is invalid or missing, userId will be null
    if (!userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // No plan checks - all features are free
    // Just verify the user exists and move to next handler
    next();  // Calls the actual route handler (e.g., generateArticle)
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
```

**Authentication Flow:**
```
1. Frontend: User logs in via Clerk UI
2. Clerk: Generates JWT token and stores in browser
3. Frontend: Sends token in Authorization header
4. Backend: clerkMiddleware() validates token signature
5. Backend: auth() middleware checks if userId exists
6. Backend: req.auth() has { userId, sessionId, ... }
7. Backend: Pass userId to controller for database queries
8. Controller: All creations tagged with user_id

Example Request:
GET /api/user/get-user-creations
Headers: { Authorization: "Bearer eyJhbGc..." }

Backend Processing:
1. clerkMiddleware validates the token
2. auth middleware extracts userId
3. getUserCreations receives userId from req.auth()
4. Query: SELECT * FROM creations WHERE user_id = ${userId}
```

---

## 🎯 API Controllers Deep Dive

### File: `server/controllers/aiController.js`

#### 1. Article Generation

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/controllers/aiController.js start=17
export const generateArticle = async (req, res) => {
  try {
    // Extract authenticated user's ID from JWT token
    const { userId } = req.auth();
    
    // Get user's input from request body (sent by frontend)
    const { prompt, length } = req.body;
    
    // Validate: User provided a prompt
    if (!prompt) {
      return res.json({
        success: false,
        message: "Prompt is required",
      });
    }
    
    // Validate: Prompt not too long (prevent abuse/excessive API calls)
    if (prompt.length > 5000) {
      return res.json({
        success: false,
        message: "Prompt is too long. Maximum 5000 characters allowed.",
      });
    }
    
    // Initialize Google Gemini AI model
    // "gemini-2.0-flash-exp" - newest, fastest Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });
    
    // Send prompt to Gemini API - it returns article text
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    // Store in database with user_id for tracking
    await sql`
      INSERT INTO creations (user_id, prompt, content, type) 
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;
    
    // Send back the generated article to frontend
    res.json({ success: true, content });
  } catch (err) {
    console.error("Error in generateArticle:", err);
    res.json({ success: false, message: err.message });
  }
};
```

**Flow:**
```
User Input: "Write an article about AI"
↓
Backend receives: { prompt: "Write an article about AI", length: 800 }
↓
Call Gemini API with prompt
↓
Gemini returns: "Artificial Intelligence is transforming..."
↓
INSERT into database: (userId: "user123", content: "AI is...", type: "article")
↓
Return to frontend: { success: true, content: "AI is..." }
↓
Frontend displays using Markdown renderer
```

---

#### 2. Image Generation (Complex)

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/controllers/aiController.js start=127
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    
    // Validate input
    if (!prompt) {
      return res.json({
        success: false,
        message: "Prompt is required",
      });
    }
    
    if (prompt.length > 1000) {
      return res.json({
        success: false,
        message: "Prompt is too long. Maximum 1000 characters allowed.",
      });
    }
    
    // ========== RATE LIMITING ==========
    // Check if user exceeded daily limit (15 images/day)
    
    // Get today's date (start of day in UTC)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Query database for images generated today
    const todayCount = await sql`
      SELECT COUNT(*) as count 
      FROM creations 
      WHERE user_id = ${userId} 
      AND type = 'image' 
      AND created_at >= ${today.toISOString()}
    `;
    
    // Extract count from query result
    const currentCount = parseInt(todayCount[0].count);
    
    // If user already generated 15 images today, block
    if (currentCount >= 15) {
      return res.json({
        success: false,
        message: `Daily limit reached! You can generate up to 15 images per day. Your limit will reset tomorrow.`,
      });
    }
    
    // ========== CALL HUGGING FACE API ==========
    // FLUX.1-schnell: Best free image generation model
    // Tested 10+ models - produces largest files (142KB) = highest quality
    
    const HF_API_URL = 
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";
    
    // Make API request with axios
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          num_inference_steps: 4,    // FLUX optimal: 4 steps
          guidance_scale: 0,          // FLUX doesn't use guidance
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/png",  // Request PNG format
        },
        responseType: "arraybuffer",  // Receive binary image data
        timeout: 90000,  // 90 second timeout
      }
    );
    
    // ========== ERROR HANDLING ==========
    // Check if API returned error (as JSON instead of image)
    if (response.headers["content-type"]?.includes("application/json")) {
      // Parse error response
      const jsonResponse = JSON.parse(Buffer.from(response.data).toString());
      
      if (jsonResponse.error) {
        // Handle specific error cases
        if (jsonResponse.error.includes("loading")) {
          return res.json({
            success: false,
            message: "Model is loading. Please wait 20 seconds and try again.",
          });
        }
        return res.json({
          success: false,
          message: jsonResponse.error,
        });
      }
    }
    
    // ========== CONVERT TO BASE64 ==========
    // Hugging Face returns binary image data
    // Convert to base64 data URL for Cloudinary upload
    
    const base64Image = `data:image/png;base64,${Buffer.from(
      response.data
    ).toString("base64")}`;
    
    // ========== UPLOAD TO CLOUDINARY ==========
    // Store image in CDN for global delivery
    
    const { secure_url } = await cloudinary.uploader.upload(base64Image);
    
    // ========== SAVE TO DATABASE ==========
    // Store metadata so we can retrieve image later
    
    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;
    
    // ========== RETURN TO FRONTEND ==========
    res.json({ success: true, content: secure_url });
    
  } catch (err) {
    // ========== ERROR HANDLING ==========
    console.error("=== ERROR IN IMAGE GENERATION ===");
    console.error("Status:", err.response?.status);
    console.error("Error Message:", err.message);
    
    // Parse error from response
    let errorMessage = "Failed to generate image. Please try again.";
    
    if (err.response?.data) {
      try {
        const errorText = Buffer.from(err.response.data).toString();
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          errorMessage = errorText.substring(0, 200);
        }
      } catch (parseErr) {
        console.error("Could not parse error response");
      }
    }
    
    // Return user-friendly error based on status code
    if (err.response?.status === 400) {
      return res.json({
        success: false,
        message: "Invalid request. " + errorMessage,
      });
    }
    
    if (err.response?.status === 503) {
      return res.json({
        success: false,
        message: "Model is loading. Please wait 30 seconds and try again.",
      });
    }
    
    if (err.response?.status === 401 || err.response?.status === 403) {
      return res.json({
        success: false,
        message: "Authentication failed. API key may be invalid.",
      });
    }
    
    res.json({ success: false, message: err.message });
  }
};
```

**Image Generation Flow:**
```
1. User sends: { prompt: "A sunset", publish: true }

2. Backend checks rate limit:
   - Query: COUNT images for userId TODAY
   - If >= 15: return error and block

3. Call Hugging Face API:
   - Endpoint: https://api-inference.huggingface.co/models/...
   - Input: prompt, inference steps, guidance scale
   - Output: Binary PNG image data

4. Convert binary to base64:
   - Buffer.from(response.data).toString("base64")
   - Prepend "data:image/png;base64," prefix

5. Upload to Cloudinary:
   - cloudinary.uploader.upload(base64Image)
   - Returns: { secure_url: "https://cloudinary.com/..." }

6. Save to database:
   - INSERT (userId, prompt, imageURL, type='image', publish=true)

7. Return to frontend:
   - { success: true, content: "https://cloudinary.com/..." }

8. Frontend displays image and allows download
```

**Key Concepts:**
- **Rate Limiting**: Query database to count today's images
- **Buffer**: Node.js tool for binary data manipulation
- **Base64**: Text representation of binary data
- **Cloudinary**: CDN that hosts the image globally
- **Error Handling**: Check status codes and parse error messages

---

#### 3. Background Removal

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/controllers/aiController.js start=304
export const removeImageBackground = async (req, res) => {
  let filePath = null;  // Track temp file for cleanup
  
  try {
    const { userId } = req.auth();
    const image = req.file;  // Added by multer middleware
    
    // Validate: File was uploaded
    if (!image) {
      return res.json({
        success: false,
        message: "Image file is required",
      });
    }
    
    // Store file path for cleanup in finally block
    filePath = image.path;
    console.log("Processing image:", image.originalname);
    
    // Upload to Cloudinary WITH background removal transformation
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });
    
    // Save result to database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
    `;
    
    console.log("Background removal successful");
    res.json({ success: true, content: secure_url });
    
  } catch (error) {
    console.error("Error in removeImageBackground:", error);
    res.json({ success: false, message: error.message });
  } finally {
    // ========== CLEANUP ==========
    // Always delete temporary file, whether success or error
    
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);  // Delete file from disk
    }
  }
};
```

**Why finally block?**
```
The finally block ensures cleanup happens in both cases:
1. SUCCESS: Remove temp file after upload to Cloudinary
2. ERROR: Still remove temp file if something failed

Without finally: Temp files would accumulate on server disk
```

---

#### 4. Resume Review

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/controllers/aiController.js start=403
export const resumeReview = async (req, res) => {
  let filePath = null;
  
  try {
    const { userId } = req.auth();
    const resume = req.file;  // PDF file from multer
    
    if (!resume) {
      return res.json({
        success: false,
        message: "Resume file is required",
      });
    }
    
    filePath = resume.path;
    
    // Prevent abuse - max 5MB
    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "File size exceeds 5MB limit.",
      });
    }
    
    // ========== EXTRACT TEXT FROM PDF ==========
    // Read PDF file from disk
    const dataBuffer = fs.readFileSync(resume.path);
    
    // Parse PDF to extract text using pdf-parse library
    const pdfData = await pdf(dataBuffer);
    
    // Validate: PDF had extractable text
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.json({
        success: false,
        message: "Could not extract text from PDF. Please ensure the file is not corrupted.",
      });
    }
    
    // ========== CREATE PROMPT FOR GEMINI ==========
    // Combine instruction with PDF text
    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;
    
    // ========== CALL GEMINI API ==========
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    // ========== SAVE TO DATABASE ==========
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (
        ${userId},
        'Review the uploaded resume',
        ${content},
        'resume-review'
      )
    `;
    
    res.json({ success: true, content });
  } catch (err) {
    console.error("Error in resumeReview:", err);
    res.json({ success: false, message: err.message });
  } finally {
    // Cleanup temp file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
```

**PDF Processing Flow:**
```
1. Multer saves PDF to: /tmp/upload_abc123.pdf

2. Read file into memory:
   const dataBuffer = fs.readFileSync(filePath)
   // dataBuffer is binary data

3. Parse PDF to text:
   const pdfData = await pdf(dataBuffer)
   // pdfData.text = "John Doe\n..."

4. Combine with instruction:
   "Review this resume:\n\n" + extractedText

5. Send to Gemini API for analysis

6. Delete temp file in finally block
```

---

### File: `server/controllers/userController.js`

#### Get User Creations

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/controllers/userController.js start=3
export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    
    // Query all creations for this user, newest first
    const creations = await sql`
      SELECT * FROM creations 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
    
    res.json({ success: true, creations });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
```

**Query Explanation:**
```sql
SELECT * FROM creations         -- Get all columns
WHERE user_id = ${userId}       -- Only this user's items
ORDER BY created_at DESC        -- Newest first (DESC = descending)
```

---

#### Toggle Like Creation

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/controllers/userController.js start=29
export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();        // Current user
    const { id } = req.body;              // Creation ID to like/unlike
    
    // Fetch the creation to check current likes
    const [creation] = await sql`
      SELECT * FROM creations WHERE id = ${id}
    `;
    
    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }
    
    // Get current likes array
    const currentLikes = creation.likes;
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;
    
    // Check if user already liked this creation
    if (currentLikes.includes(userIdStr)) {
      // Already liked → Remove the like
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation Unliked";
    } else {
      // Not liked yet → Add the like
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }
    
    // Convert array back to PostgreSQL format: {user1,user2,user3}
    const formattedArray = `{${updatedLikes.join(",")}}`;
    
    // Update database with new likes array
    await sql`
      UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}
    `;
    
    res.json({ success: true, message });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
```

**Array Operation Walkthrough:**
```javascript
// Scenario 1: User likes for first time
currentLikes = ["user1", "user2"]
userId = "user3"

// Check if user3 already liked?
currentLikes.includes("user3") → false

// Add user3 to array
updatedLikes = [...currentLikes, "user3"]
// Result: ["user1", "user2", "user3"]

// Convert to PostgreSQL format
formattedArray = "{user1,user2,user3}"

// Update DB
UPDATE creations SET likes = '{user1,user2,user3}'::text[]
```

---

#### Delete Creation

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/server/controllers/userController.js start=69
export const deleteCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.params;  // URL parameter: /delete-creation/123
    
    // Check if creation exists AND belongs to current user
    // (Prevents user from deleting others' creations)
    const [creation] = await sql`
      SELECT * FROM creations WHERE id = ${id} AND user_id = ${userId}
    `;
    
    if (!creation) {
      return res.json({
        success: false,
        message: "Creation not found or unauthorized",
      });
    }
    
    // Delete the creation
    await sql`
      DELETE FROM creations WHERE id = ${id} AND user_id = ${userId}
    `;
    
    res.json({ success: true, message: "Creation deleted successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
```

**Security Pattern:**
```javascript
// WRONG - allows user to delete anyone's creation:
DELETE FROM creations WHERE id = ${id}

// CORRECT - only deletes user's own creation:
DELETE FROM creations WHERE id = ${id} AND user_id = ${userId}

This prevents:
- Unauthorized deletion
- Cross-user data access
- Security breach
```

---

## 💻 Frontend Architecture

### File: `client/src/App.jsx`

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/client/src/App.jsx start=1
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/DashBoard";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import GenerateImages from "./pages/GenerateImages";
import RemoveBackground from "./pages/RemoveBackground";
import RemoveObject from "./pages/RemoveObject";
import ReviewResume from "./pages/ReviewResume";
import Community from "./pages/Community";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      {/* Toast notifications - displays at top of page */}
      <Toaster></Toaster>
      
      <Routes>
        {/* Public route - anyone can view */}
        <Route path="/" element={<Home />} />
        
        {/* Protected routes - all share Layout wrapper */}
        <Route path="/ai" element={<Layout />}>
          {/* Nested routes share the Layout's sidebar/navbar */}
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
```

**Routing Structure:**
```
/                       → Home page (public)
/ai                     → Dashboard (protected, shows Layout)
/ai/write-article       → Article writer tool
/ai/blog-titles         → Blog title generator
/ai/generate-images     → Image generator
/ai/community           → Community gallery
```

---

### Page: `client/src/pages/WriteArticle.jsx`

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/client/src/pages/WriteArticle.jsx start=11
const WriteArticle = () => {
  // Article length options
  const articleLength = [
    { length: 800, text: "Short", desc: "500-800 words" },
    { length: 1200, text: "Medium", desc: "800-1200 words" },
    { length: 1600, text: "Long", desc: "1200+ words" },
  ];
  
  // Component state
  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");           // User's topic
  const [loading, setLoading] = useState(false);   // API call in progress
  const [content, setContent] = useState("");      // Generated article
  const [copied, setCopied] = useState(false);     // Copy button state
  
  // Clerk hook to get authentication token
  const { getToken } = useAuth();
  
  // Form submission handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();  // Prevent page reload
    try {
      setLoading(true);
      
      // Build prompt with user input and selected length
      const prompt = `Write an article ${input} in ${selectedLength.text} (${selectedLength.desc})`;
      
      // Call backend API
      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        { 
          headers: { 
            Authorization: `Bearer ${await getToken()}` 
          } 
        }
      );
      
      // Check success response
      if (data.success === true) {
        setContent(data.content);  // Display article
        toast.success("Article generated successfully!");
      } else {
        toast.error(data.message);  // Show error message
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  
  // Copy article to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Article copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);  // Reset after 2 seconds
  };
  
  return (
    <div className="h-full overflow-y-scroll bg-[#0A0A0F]">
      {/* Grid background pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(...)] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1>AI Article Writer</h1>
          <p>Generate high-quality, SEO-optimized articles</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left column - Input form */}
          <form onSubmit={onSubmitHandler}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., The Impact of AI on Healthcare"
              required
              maxLength={5000}
            />
            
            {/* Length selector buttons */}
            <div className="grid grid-cols-3 gap-3">
              {articleLength.map((item) => (
                <button
                  type="button"
                  onClick={() => setSelectedLength(item)}
                  className={
                    selectedLength.text === item.text 
                      ? "selected-style" 
                      : "unselected-style"
                  }
                >
                  {item.text}
                </button>
              ))}
            </div>
            
            {/* Submit button */}
            <button type="submit" disabled={loading}>
              {loading ? "Crafting..." : "Generate Article"}
            </button>
          </form>
          
          {/* Right column - Generated article */}
          <div>
            {!content ? (
              <p>Your generated article will appear here...</p>
            ) : (
              <>
                <button onClick={copyToClipboard}>
                  {copied ? "Copied!" : "Copy"}
                </button>
                <Markdown>{content}</Markdown>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Frontend Flow:**
```
1. User enters "Write an article about AI"
2. Selects "Medium" length (800-1200 words)
3. Clicks "Generate Article" button
4. onSubmitHandler executes:
   - setLoading(true) - Shows spinner
   - Call axios.post("/api/ai/generate-article")
   - Include Bearer token in header
5. Backend processes and returns article
6. setContent(article) - Display article
7. User can copy or keep browsing
```

---

### Page: `client/src/pages/GenerateImages.jsx`

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/client/src/pages/GenerateImages.jsx start=9
const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli style",
    "Cartoon style",
    "Anime style",
    "Fantasy style",
    "3D style",
    "Portrait style",
    "Oil painting",
  ];
  
  // Component state
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);       // Share to community?
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");          // Generated image URL
  const [usage, setUsage] = useState({                 // Daily usage tracking
    limit: 15,
    used: 0,
    remaining: 15,
  });
  
  const { getToken } = useAuth();
  
  // Fetch current day's usage when component mounts
  useEffect(() => {
    fetchUsage();
  }, []);
  
  const fetchUsage = async () => {
    try {
      const { data } = await axios.get("/api/ai/image-usage", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setUsage(data);  // { limit: 15, used: 5, remaining: 10 }
      }
    } catch (error) {
      console.error("Error fetching usage:", error);
    }
  };
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Build descriptive prompt
      const prompt = `Generate an image for ${input} in the style ${selectedStyle}`;
      
      // Call backend to generate image
      const { data } = await axios.post(
        "/api/ai/generate-images",
        { prompt, publish },  // publish determines if shared to community
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      
      if (data.success === true) {
        setContent(data.content);           // Show image
        fetchUsage();                        // Update usage quota
        toast.success("Image generated successfully!");
      } else {
        toast.error(data?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate image");
    }
    setLoading(false);
  };
  
  const downloadImage = () => {
    if (content) {
      // Create temporary link to download image
      const link = document.createElement("a");
      link.href = content;
      link.download = `ai-generated-${Date.now()}.png`;
      link.click();
      toast.success("Image downloaded!");
    }
  };
  
  return (
    <div>
      {/* Usage badge showing remaining quota */}
      <div className="mb-6">
        <span>
          {usage.remaining} of {usage.limit} generations remaining today
        </span>
      </div>
      
      <form onSubmit={onSubmitHandler}>
        {/* Prompt input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="A serene landscape with mountains..."
          maxLength={1000}
        />
        
        {/* Style selector buttons */}
        <div className="flex gap-2 flex-wrap">
          {imageStyle.map((item) => (
            <button
              type="button"
              onClick={() => setSelectedStyle(item)}
              className={
                selectedStyle === item ? "active-style" : "inactive-style"
              }
            >
              {item}
            </button>
          ))}
        </div>
        
        {/* Share to community toggle */}
        <div className="flex items-center gap-3">
          <span>Share with community</span>
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
        </div>
        
        {/* Generate button - disabled if no quota left */}
        <button
          disabled={loading || usage.remaining === 0}
          type="submit"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>
      
      {/* Generated image display */}
      {content && (
        <div>
          <img src={content} alt="Generated" />
          <button onClick={downloadImage}>Download</button>
        </div>
      )}
    </div>
  );
};
```

**Rate Limit Pattern:**
```javascript
// 1. Fetch usage when component loads
useEffect(() => {
  fetchUsage()  // GET /api/ai/image-usage
}, [])

// 2. Display remaining quota
{usage.remaining} of {usage.limit} generations

// 3. Disable button if no quota
<button disabled={usage.remaining === 0}>
  Generate Image
</button>

// 4. Refresh usage after generation
await generateImage()
fetchUsage()  // Update UI with new quota
```

---

### Page: `client/src/pages/Community.jsx`

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/client/src/pages/Community.jsx start=9
const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();              // Current logged-in user
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  
  // Fetch all published creations
  const fetchCreations = async () => {
    try {
      const { data } = await axios.get(
        "/api/user/get-published-creations",
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  
  // Toggle like on a creation
  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      
      if (data.success) {
        toast.success(data.message);
        await fetchCreations();  // Refresh to show new likes count
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  // Load creations when component mounts
  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <h1>Community Gallery</h1>
      
      {creations.length === 0 ? (
        <div>
          <p>No creations yet</p>
          <p>Be the first to share your AI-generated images!</p>
        </div>
      ) : (
        // Grid of creations
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {creations.map((creation, index) => (
            <div key={index} className="creation-card">
              <img
                src={creation.content}
                alt={creation.prompt}
              />
              
              {/* Hover overlay with info */}
              <div className="hover-overlay">
                <p>{creation.prompt}</p>
                
                <div className="flex justify-between">
                  <p>by {creation.user_name || user.fullName}</p>
                  
                  <div className="flex gap-2">
                    <span>{creation.likes.length}</span>
                    
                    {/* Like button - filled if current user liked */}
                    <Heart
                      onClick={() => imageLikeToggle(creation.id)}
                      className={
                        creation.likes.includes(user.id)
                          ? "fill-red-500 text-red-500"  // Already liked
                          : "text-white hover:text-red-400"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

**Community Gallery Flow:**
```
1. User visits /ai/community
2. fetchCreations() runs on mount
3. Backend returns: [
     { id: 1, content: "img_url", likes: ["user1", "user2"], prompt: "..." },
     { id: 2, content: "img_url", likes: ["user1"], prompt: "..." },
   ]
4. Map over creations and display as grid
5. User hovers over image → see prompt + like count
6. User clicks heart → imageLikeToggle(creation.id)
7. Backend toggles user ID in likes array
8. Refresh creations to show updated like count
9. Heart filled if current user's ID in likes array
```

---

### Page: `client/src/pages/DashBoard.jsx`

```javascript path=/Users/raghular/Documents/Projects/VectorAI/AI-SaaS/client/src/pages/DashBoard.jsx start=18
export default function DashBoard() {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { getToken } = useAuth();
  
  // Fetch user's creations on mount
  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(`/api/user/get-user-creations`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      
      if (data.success === true) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  
  // Delete single creation
  const deleteCreation = async (id) => {
    // Confirm before delete
    if (!window.confirm("Are you sure you want to delete this creation?")) {
      return;
    }
    
    try {
      const { data } = await axios.delete(
        `/api/user/delete-creation/${id}`,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      
      if (data.success) {
        // Remove from local state
        setCreations(creations.filter((item) => item.id !== id));
        toast.success("Creation deleted successfully");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to delete creation");
    }
  };
  
  // Clear ALL creations
  const clearAllHistory = async () => {
    // Double confirm for destructive action
    if (
      !window.confirm(
        "Are you sure you want to clear all your creations? This action cannot be undone."
      )
    ) {
      return;
    }
    
    try {
      setDeleting(true);
      const { data } = await axios.delete(
        `/api/user/clear-all-creations`,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      
      if (data.success) {
        setCreations([]);
        toast.success("All creations cleared successfully");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to clear creations");
    } finally {
      setDeleting(false);
    }
  };
  
  useEffect(() => {
    getDashboardData();
  }, []);
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* Total Creations */}
        <div className="card">
          <h3>{creations.length}</h3>
          <p>Total Creations</p>
        </div>
        
        {/* This Week */}
        <div className="card">
          <h3>
            {
              creations.filter((c) => {
                // Calculate days since creation
                const diff = Date.now() - new Date(c.created_at).getTime();
                // Convert to days: milliseconds → 7 days
                return diff < 7 * 24 * 60 * 60 * 1000;
              }).length
            }
          </h3>
          <p>This Week</p>
        </div>
        
        {/* Clear All Button */}
        <div className="card">
          <button
            onClick={clearAllHistory}
            disabled={deleting || creations.length === 0}
          >
            {deleting ? "Clearing..." : "Clear All History"}
          </button>
        </div>
      </div>
      
      {/* Creations List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          <h2>Recent Creations</h2>
          
          {creations.length === 0 ? (
            <p>No creations yet. Start creating!</p>
          ) : (
            creations.map((creation) => (
              <CreationItem
                key={creation.id}
                creation={creation}
                onDelete={deleteCreation}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
```

**Dashboard Stats Logic:**
```javascript
// Filter creations from this week
creations.filter((c) => {
  const diff = Date.now() - new Date(c.created_at).getTime()
  // diff is milliseconds
  
  // 7 days = 7 * 24 * 60 * 60 * 1000 ms = 604,800,000 ms
  // If diff < 604,800,000, creation is less than 7 days old
  return diff < 7 * 24 * 60 * 60 * 1000
}).length
```

---

## 🧠 Common Patterns & Concepts

### 1. Authentication Pattern

**Frontend:**
```javascript
import { useAuth } from "@clerk/clerk-react";

const { getToken } = useAuth();
const token = await getToken();

axios.post("/api/ai/generate-article", data, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**Backend:**
```javascript
import { requireAuth } from "@clerk/express";

app.use("/api/ai", requireAuth(), router);  // Middleware

export const generateArticle = async (req, res) => {
  const { userId } = req.auth();  // Extracted from token
};
```

---

### 2. Error Handling Pattern

**Frontend:**
```javascript
try {
  const { data } = await axios.post("/api/endpoint", payload);
  
  if (data.success === true) {
    toast.success("Success!");
  } else {
    toast.error(data.message);  // Server returned error
  }
} catch (err) {
  toast.error(err.response?.data?.message || "Network error");
}
```

**Backend:**
```javascript
try {
  // Do something
  res.json({ success: true, data: result });
} catch (err) {
  res.json({ success: false, message: err.message });
}
```

---

### 3. File Upload Pattern

**Frontend:**
```javascript
const handleFileChange = (e) => {
  const file = e.target.files[0];
  
  const formData = new FormData();
  formData.append("image", file);  // Key matches multer.single("image")
  
  axios.post("/api/ai/remove-background", formData, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      "Content-Type": "multipart/form-data"  // Important!
    }
  });
};
```

**Backend:**
```javascript
import multer from "multer";
const upload = multer({ dest: "uploads/" });

app.post("/remove-background", upload.single("image"), handler);

export const handler = async (req, res) => {
  const file = req.file;  // Contains: path, originalname, size, mimetype
  // Process file at req.file.path
};
```

---

### 4. State Management Pattern

**React Hooks:**
```javascript
const [state, setState] = useState(initialValue);

// Update state
setState(newValue);

// Conditional rendering based on state
{state ? <Component /> : <Alternative />}

// Update after async operation
const fetchData = async () => {
  setLoading(true);
  const data = await api.fetch();
  setData(data);
  setLoading(false);
};
```

---

### 5. API Response Pattern

**Standard Response Format:**
```javascript
// Success:
{
  success: true,
  content: "Generated article text...",
  // or
  creations: [{...}, {...}]
}

// Error:
{
  success: false,
  message: "User-friendly error message"
}
```

---

### 6. Rate Limiting Pattern

**Check quota before action:**
```javascript
// Backend
const today = new Date();
today.setHours(0, 0, 0, 0);

const count = await sql`
  SELECT COUNT(*) FROM creations 
  WHERE user_id = ${userId} 
  AND type = 'image' 
  AND created_at >= ${today}
`;

if (count[0].count >= LIMIT) {
  return error("Limit reached");
}
```

---

### 7. Finally Block Pattern

**Ensure cleanup regardless of success/error:**
```javascript
let filePath = null;

try {
  // Do something
  filePath = req.file.path;
} catch (err) {
  // Handle error
} finally {
  // Always runs - cleanup
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);  // Delete temp file
  }
}
```

---

### 8. Array Toggle Pattern

**Like/unlike using array operations:**
```javascript
const currentLikes = [" user1", "user2"];
const userId = "user3";

if (currentLikes.includes(userId)) {
  // Already liked - remove
  const newLikes = currentLikes.filter(id => id !== userId);
} else {
  // Not liked - add
  const newLikes = [...currentLikes, userId];
}
```

---

### 9. Effect Hook Pattern

**Run code when component mounts or dependencies change:**
```javascript
useEffect(() => {
  // Runs once on mount
  fetchData();
}, []);  // Empty dependency array

useEffect(() => {
  // Runs when user or getToken changes
  if (user) {
    fetchData();
  }
}, [user]);  // Dependency array

// Cleanup function (runs on unmount or before re-run)
useEffect(() => {
  const listener = () => console.log("Event");
  window.addEventListener("event", listener);
  
  return () => {
    window.removeEventListener("event", listener);
  };
}, []);
```

---

## 🎓 Key Takeaways

| Concept | Purpose | Example |
|---------|---------|---------|
| **Middleware** | Process request before handler | `requireAuth()`, `upload.single()` |
| **Route Params** | Dynamic URL values | `/delete-creation/:id` |
| **Template Literals** | SQL injection prevention | `` `SELECT * WHERE id = ${id}` `` |
| **Async/Await** | Handle promises | `await generateImage()` |
| **Try/Catch** | Error handling | Wrap API calls |
| **State Management** | React reactivity | `useState()`, `useEffect()` |
| **Props** | Component communication | Pass data down |
| **Controlled Inputs** | Form inputs tied to state | `value={state}` |
| **Event Handlers** | User interactions | `onClick`, `onChange`, `onSubmit` |
| **Conditional Rendering** | Show/hide based on state | `{loading ? <Spinner /> : <Content />}` |

---

This guide should help you understand the code deeply and explain any part during interviews!
