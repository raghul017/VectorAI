# Image Generation Rate Limit Implementation

## ✅ What's Been Added

### Backend Changes

1. **Daily Limit Constant**: 15 images per user per day
2. **Rate Limit Check**: Automatically checks usage before generating images
3. **Usage Tracking Endpoint**: New GET endpoint to check remaining quota

### API Endpoints

#### 1. Generate Image (with rate limit)

```
POST /api/ai/generate-images
```

- Checks if user has exceeded 15 images/day
- Returns error message if limit reached

#### 2. Check Usage (NEW!)

```
GET /api/ai/image-usage
```

Response:

```json
{
  "success": true,
  "limit": 15,
  "used": 7,
  "remaining": 8,
  "resetTime": "2025-10-24T00:00:00.000Z"
}
```

## 📝 How to Display on Frontend

### Option 1: Show remaining count before generation

Add this to your `GenerateImages.jsx`:

```javascript
import { useEffect, useState } from "react";
import axios from "axios";

const [usage, setUsage] = useState({ limit: 15, used: 0, remaining: 15 });

// Fetch usage when component loads
useEffect(() => {
  fetchUsage();
}, []);

const fetchUsage = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/ai/image-usage`,
      {
        headers: {
          Authorization: `Bearer ${await window.Clerk.session.getToken()}`,
        },
      }
    );
    if (response.data.success) {
      setUsage(response.data);
    }
  } catch (error) {
    console.error("Error fetching usage:", error);
  }
};

// Display in UI
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
  <p className="text-sm text-blue-800">
    📊 Daily Limit:{" "}
    <strong>
      {usage.used}/{usage.limit}
    </strong>{" "}
    images used
    {usage.remaining > 0 ? (
      <span className="text-green-600 ml-2">
        ✓ {usage.remaining} remaining today
      </span>
    ) : (
      <span className="text-red-600 ml-2">
        ⚠️ Limit reached. Resets tomorrow.
      </span>
    )}
  </p>
</div>;
```

### Option 2: Simple Badge Display

```javascript
<div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Generate AI Images</h2>
  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
    {usage.remaining}/{usage.limit} left today
  </span>
</div>
```

### Option 3: Progress Bar

```javascript
<div className="mb-4">
  <div className="flex justify-between text-sm mb-1">
    <span>Daily Usage</span>
    <span>
      {usage.used}/{usage.limit}
    </span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-600 h-2 rounded-full transition-all"
      style={{ width: `${(usage.used / usage.limit) * 100}%` }}
    />
  </div>
</div>
```

## 🎯 Features

✅ **Automatic Reset**: Limit resets at midnight (00:00:00) daily
✅ **Per-User Tracking**: Each user has their own 15 image limit
✅ **Clear Error Messages**: Users are informed when limit is reached
✅ **Usage Endpoint**: Frontend can check remaining quota anytime
✅ **Database-Driven**: Uses existing creations table (no new migrations needed)

## 💡 Benefits

1. **Protects Free Tier**: 15 images/user/day = ~450 images/month per user
2. **Prevents Abuse**: Stops users from exhausting your Hugging Face 30K/month quota
3. **Fair Usage**: Every user gets equal access
4. **Room to Grow**: Even with 100 users, you stay within 30K free tier

## 🔧 Customization

To change the daily limit, modify the constant in `aiController.js`:

```javascript
const DAILY_IMAGE_LIMIT = 15; // Change to any number
```

## 📊 Math Check

- 15 images/user/day × 30 days = 450 images/user/month
- With 60 active users = 27,000 images/month
- Still under Hugging Face's 30,000/month free tier! ✅
