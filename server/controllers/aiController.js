import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

// Initialize AI clients
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Constants
const DAILY_IMAGE_LIMIT = 15;
const MAX_RETRIES = 3;
const INITIAL_DELAY = 2000;

// Helper: Delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Generate with Groq (Primary)
const generateWithGroq = async (prompt, systemPrompt = "You are a helpful assistant.") => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", // Latest Llama 3.3 model - fast and powerful
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 4096,
  });
  return response.choices[0]?.message?.content || "";
};

// Helper: Generate with Gemini (Fallback)
const generateWithGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Helper: Generate content with fallback (Groq → Gemini)
const generateContent = async (prompt, systemPrompt) => {
  let lastError;
  
  // Try Groq first (Primary)
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Groq] Attempt ${attempt}/${MAX_RETRIES}...`);
      return { content: await generateWithGroq(prompt, systemPrompt), provider: "groq" };
    } catch (err) {
      lastError = err;
      console.error(`[Groq] Attempt ${attempt} failed:`, err.message);
      
      const isRateLimit = err.status === 429 || err.message?.includes('rate') || err.message?.includes('429');
      
      if (isRateLimit && attempt < MAX_RETRIES) {
        const waitTime = INITIAL_DELAY * Math.pow(2, attempt - 1);
        console.log(`[Groq] Rate limited. Waiting ${waitTime/1000}s...`);
        await delay(waitTime);
      } else if (!isRateLimit) {
        break; // Non-rate-limit error, try fallback
      }
    }
  }
  
  // Fallback to Gemini
  console.log("[Gemini] Falling back to Gemini...");
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Gemini] Attempt ${attempt}/${MAX_RETRIES}...`);
      return { content: await generateWithGemini(prompt), provider: "gemini" };
    } catch (err) {
      lastError = err;
      console.error(`[Gemini] Attempt ${attempt} failed:`, err.message);
      
      const isRateLimit = err.message?.includes('429') || err.message?.includes('quota');
      
      if (isRateLimit && attempt < MAX_RETRIES) {
        const waitTime = INITIAL_DELAY * Math.pow(2, attempt - 1);
        console.log(`[Gemini] Rate limited. Waiting ${waitTime/1000}s...`);
        await delay(waitTime);
      } else if (!isRateLimit) {
        break;
      }
    }
  }
  
  throw lastError;
};

// Helper: Parse rate limit error for user-friendly message
const parseRateLimitError = (err) => {
  const errorStr = err.message || '';
  const retryMatch = errorStr.match(/retry in (\d+\.?\d*)/i);
  const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
  
  if (err.status === 429 || errorStr.includes('quota') || errorStr.includes('429') || errorStr.includes('rate')) {
    return { isRateLimit: true, message: `AI service is busy. Please try again in ${retrySeconds} seconds.`, retryAfter: retrySeconds };
  }
  
  return { isRateLimit: false, message: err.message };
};

// Article Generation
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;

    if (!prompt) return res.json({ success: false, message: "Prompt is required" });
    if (prompt.length > 5000) return res.json({ success: false, message: "Prompt is too long. Maximum 5000 characters allowed." });

    const systemPrompt = `You are an expert content writer. Write engaging, well-structured articles that are SEO-optimized and informative. Use proper headings, paragraphs, and formatting.`;
    
    const { content, provider } = await generateContent(prompt, systemPrompt);
    console.log(`Article generated using: ${provider}`);

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    res.json({ success: true, content, provider });
  } catch (err) {
    console.error("Error in generateArticle:", err);
    const { isRateLimit, message, retryAfter } = parseRateLimitError(err);
    
    if (isRateLimit) {
      return res.status(429).json({ success: false, message, retryAfter, code: 'RATE_LIMITED' });
    }
    res.json({ success: false, message: err.message });
  }
};

// Get user's daily image generation usage
export const getImageUsage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await sql`
      SELECT COUNT(*) as count FROM creations 
      WHERE user_id = ${userId} AND type = 'image' AND created_at >= ${today.toISOString()}
    `;

    const used = parseInt(todayCount[0].count);
    const remaining = DAILY_IMAGE_LIMIT - used;

    res.json({
      success: true,
      limit: DAILY_IMAGE_LIMIT,
      used,
      remaining: remaining > 0 ? remaining : 0,
      resetTime: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (err) {
    console.error("Error in getImageUsage:", err);
    res.json({ success: false, message: err.message });
  }
};

// Blog Title Generation
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;

    if (!prompt) return res.json({ success: false, message: "Prompt is required" });
    if (prompt.length > 5000) return res.json({ success: false, message: "Prompt is too long. Maximum 5000 characters allowed." });

    const systemPrompt = `You are an expert blog title generator. Create catchy, clickable, and SEO-friendly blog titles. Provide multiple creative options.`;
    
    const { content, provider } = await generateContent(prompt, systemPrompt);
    console.log(`Blog titles generated using: ${provider}`);

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog')`;

    res.json({ success: true, content, provider });
  } catch (err) {
    console.error("Error in generateBlogTitle:", err);
    const { isRateLimit, message, retryAfter } = parseRateLimitError(err);
    
    if (isRateLimit) {
      return res.status(429).json({ success: false, message, retryAfter, code: 'RATE_LIMITED' });
    }
    res.json({ success: false, message: err.message });
  }
};

// Image Generation using Hugging Face
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;

    if (!prompt) return res.json({ success: false, message: "Prompt is required" });
    if (prompt.length > 1000) return res.json({ success: false, message: "Prompt is too long. Maximum 1000 characters allowed." });

    // Check daily rate limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await sql`
      SELECT COUNT(*) as count FROM creations 
      WHERE user_id = ${userId} AND type = 'image' AND created_at >= ${today.toISOString()}
    `;

    const currentCount = parseInt(todayCount[0].count);
    console.log(`User ${userId} has generated ${currentCount}/${DAILY_IMAGE_LIMIT} images today`);

    if (currentCount >= DAILY_IMAGE_LIMIT) {
      return res.json({ success: false, message: `Daily limit reached! You can generate up to ${DAILY_IMAGE_LIMIT} images per day. Your limit will reset tomorrow.` });
    }

    console.log("Generating image with prompt:", prompt);

    const HF_API_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";

    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt, parameters: { num_inference_steps: 4, guidance_scale: 0 } },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/png",
        },
        responseType: "arraybuffer",
        timeout: 90000,
      }
    );

    if (response.headers["content-type"]?.includes("application/json")) {
      const jsonResponse = JSON.parse(Buffer.from(response.data).toString());
      if (jsonResponse.error) {
        return res.json({
          success: false,
          message: jsonResponse.error.includes("loading") ? "Model is warming up. Please wait 20 seconds and try again." : jsonResponse.error,
        });
      }
    }

    const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

    console.log("Image generation completed!");
    res.json({ success: true, content: secure_url });
  } catch (err) {
    console.error("=== ERROR IN IMAGE GENERATION ===", err.message);

    let errorMessage = "Failed to generate image. Please try again.";

    if (err.response?.data) {
      try {
        const errorText = Buffer.from(err.response.data).toString();
        try { const errorData = JSON.parse(errorText); if (errorData.error) errorMessage = errorData.error; } catch (e) { errorMessage = errorText.substring(0, 200); }
      } catch (parseErr) {}
    }

    if (err.response?.status === 503) return res.json({ success: false, message: "Image model is warming up. Please wait 30 seconds and try again.", code: 'MODEL_LOADING' });
    if (err.response?.status === 429) return res.status(429).json({ success: false, message: "Image service is busy. Please try again in 1 minute.", retryAfter: 60, code: 'RATE_LIMITED' });

    res.json({ success: false, message: errorMessage });
  }
};

// Remove Background Image
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;

    if (!image) return res.json({ success: false, message: "Image file is required" });

    console.log("Processing image:", image.originalname, "Size:", image.size);

    const base64Image = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image, {
      transformation: [{ effect: "background_removal", background_removal: "remove_the_background" }],
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    console.log("Background removal successful");
    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Error in removeImageBackground:", error);
    if (error.code === 'LIMIT_FILE_SIZE') return res.json({ success: false, message: "File too large. Maximum size is 4MB." });
    res.json({ success: false, message: error.message });
  }
};

// Remove Object from Image
export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const { object } = req.body;

    if (!image) return res.json({ success: false, message: "Image file is required" });
    if (!object) return res.json({ success: false, message: "Object description is required" });

    console.log("Removing object:", object, "from image:", image.originalname);

    const base64Image = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
    const { public_id } = await cloudinary.uploader.upload(base64Image);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image')`;

    res.json({ success: true, content: imageUrl });
  } catch (err) {
    console.error("Error in removeImageObject:", err);
    if (err.code === 'LIMIT_FILE_SIZE') return res.json({ success: false, message: "File too large. Maximum size is 4MB." });
    res.json({ success: false, message: err.message });
  }
};

// Resume Review
export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;

    if (!resume) return res.json({ success: false, message: "Resume file is required" });

    console.log("Reviewing resume:", resume.originalname, "Size:", resume.size);

    if (resume.size > 4 * 1024 * 1024) return res.json({ success: false, message: "File size exceeds 4MB limit." });

    const dataBuffer = resume.buffer;
    const pdfData = await pdf(dataBuffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.json({ success: false, message: "Could not extract text from PDF. Please ensure the file is not corrupted." });
    }

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement:\n\n${pdfData.text}`;
    const systemPrompt = `You are an expert HR professional and career coach. Provide detailed, actionable resume feedback.`;
    
    const { content, provider } = await generateContent(prompt, systemPrompt);
    console.log(`Resume review generated using: ${provider}`);

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

    res.json({ success: true, content, provider });
  } catch (err) {
    console.error("Error in resumeReview:", err);
    if (err.code === 'LIMIT_FILE_SIZE') return res.json({ success: false, message: "File too large. Maximum size is 4MB." });
    
    const { isRateLimit, message, retryAfter } = parseRateLimitError(err);
    if (isRateLimit) return res.status(429).json({ success: false, message, retryAfter, code: 'RATE_LIMITED' });
    
    res.json({ success: false, message: err.message });
  }
};
