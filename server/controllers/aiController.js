import { GoogleGenerativeAI } from "@google/generative-ai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Article Generation
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;

    // Validate input
    if (!prompt) {
      return res.json({
        success: false,
        message: "Prompt is required",
      });
    }

    // All features are free - use the best model for everyone
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    res.json({ success: true, content });
  } catch (err) {
    console.error("Error in generateArticle:", err);
    res.json({ success: false, message: err.message });
  }
};

// Blog Generation
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;

    // Validate input
    if (!prompt) {
      return res.json({
        success: false,
        message: "Prompt is required",
      });
    }

    // All features are free - use the best model for everyone
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    await sql`INSERT INTO creations (user_id, prompt, content, type)
    VALUES (${userId}, ${prompt}, ${content}, 'blog')`;

    res.json({ success: true, content });
  } catch (err) {
    console.error("Error in generateBlogTitle:", err);
    res.json({ success: false, message: err.message });
  }
};

// Image Generation using FREE Hugging Face Inference API
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

    console.log("Generating image with prompt:", prompt);
    console.log(
      "Using Hugging Face API Key:",
      process.env.HUGGINGFACE_API_KEY?.substring(0, 10) + "..."
    );

    // Using FLUX.1-schnell - fast and free, no license acceptance needed
    const HF_API_URL =
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
        timeout: 90000, // 90 second timeout
      }
    );

    console.log("Response status:", response.status);
    console.log("Response content-type:", response.headers["content-type"]);

    // Check if response is an error message (JSON)
    if (response.headers["content-type"]?.includes("application/json")) {
      const jsonResponse = JSON.parse(Buffer.from(response.data).toString());
      console.error("API returned JSON (error):", jsonResponse);

      if (jsonResponse.error) {
        return res.json({
          success: false,
          message: jsonResponse.error.includes("loading")
            ? "Model is loading. Please wait 20 seconds and try again."
            : jsonResponse.error,
        });
      }
    }

    // Convert raw bytes to base64 data URI
    const base64Image = `data:image/png;base64,${Buffer.from(
      response.data
    ).toString("base64")}`;

    console.log("Image converted to base64, uploading to Cloudinary...");

    // Upload to Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(base64Image);
    console.log("Uploaded to Cloudinary:", secure_url);

    // Persist to database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    console.log("Image generation completed successfully!");
    res.json({ success: true, content: secure_url });
  } catch (err) {
    console.error("=== ERROR IN IMAGE GENERATION ===");
    console.error("Status:", err.response?.status);
    console.error("Status Text:", err.response?.statusText);
    console.error("Error Message:", err.message);

    // Try to parse error response
    let errorMessage = "Failed to generate image. Please try again.";

    if (err.response?.data) {
      try {
        const errorText = Buffer.from(err.response.data).toString();
        console.error("Error Response:", errorText);

        // Try to parse as JSON
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // Not JSON, use raw text
          errorMessage = errorText.substring(0, 200);
        }
      } catch (parseErr) {
        console.error("Could not parse error response");
      }
    }

    // Handle specific status codes
    if (err.response?.status === 400) {
      return res.json({
        success: false,
        message: "Invalid request. " + errorMessage,
      });
    }

    if (err.response?.status === 404) {
      return res.json({
        success: false,
        message: "Model not found. Please try again.",
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

    if (err.response?.status === 503) {
      return res.json({
        success: false,
        message: "Model is loading. Please wait 20 seconds and try again.",
      });
    }
    res.json({ success: false, message: err.message });
  }
};

// Remove Background Image
export const removeImageBackground = async (req, res) => {
  let filePath = null;

  try {
    const { userId } = req.auth();
    const image = req.file;

    // Validate input
    if (!image) {
      return res.json({
        success: false,
        message: "Image file is required",
      });
    }

    filePath = image.path;
    console.log("Processing image:", image.originalname);

    // All features are free - everyone can remove backgrounds
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    // Save to database
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
    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export const removeImageObject = async (req, res) => {
  let filePath = null;

  try {
    const { userId } = req.auth();
    const image = req.file;
    const { object } = req.body;

    // Validate input
    if (!image) {
      return res.json({
        success: false,
        message: "Image file is required",
      });
    }

    if (!object) {
      return res.json({
        success: false,
        message: "Object description is required",
      });
    }

    filePath = image.path;

    // All features are free - everyone can remove objects
    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    // Persist to database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });
  } catch (err) {
    console.error("Error in removeImageObject:", err);
    res.json({ success: false, message: err.message });
  } finally {
    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export const resumeReview = async (req, res) => {
  let filePath = null;

  try {
    const { userId } = req.auth();
    const resume = req.file;

    // Validate input
    if (!resume) {
      return res.json({
        success: false,
        message: "Resume file is required",
      });
    }

    filePath = resume.path;

    // All features are free - everyone can get resume reviews
    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "File size exceeds 5MB limit.",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.json({
        success: false,
        message:
          "Could not extract text from PDF. Please ensure the file is not corrupted.",
      });
    }

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;

    // Use the best available model for resume review
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const result = await model.generateContent(prompt);
    const content = result.response.text();

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
    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
