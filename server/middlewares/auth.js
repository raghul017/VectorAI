import { clerkClient } from "@clerk/express";

// Simplified auth middleware - all features are free
export const auth = async (req, res, next) => {
  try {
    const { userId } = await req.auth();

    // Just verify the user exists
    if (!userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // No plan checks or usage limits - everything is free
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
