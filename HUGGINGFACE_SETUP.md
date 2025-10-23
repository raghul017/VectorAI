# 🎨 FREE Hugging Face Image Generation Setup

## ✅ Why Hugging Face?

- **100% FREE** - No credit card required!
- **No usage limits** on free tier
- **High-quality images** using Stable Diffusion 2.1
- **No installation** - Just an API call

## 📝 Step-by-Step Setup (5 minutes)

### 1. Create FREE Hugging Face Account

1. Go to: https://huggingface.co/join
2. Sign up with your email (FREE, no payment needed)
3. Verify your email

### 2. Get Your FREE API Token

1. Go to: https://huggingface.co/settings/tokens
2. Click **"New token"**
3. Name: `VectorAI-Image-Generation`
4. Type: Select **"Read"** (free forever!)
5. Click **"Generate a token"**
6. **Copy the token** (looks like: `hf_xxxxxxxxxxxxxxxxxxxxx`)

### 3. Add Token to Your Project

**Local Development:**
Open `server/.env` and replace:

```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

With your actual token:

```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
```

**Vercel Deployment:**

1. Go to: https://vercel.com/dashboard
2. Select your **vectorai-server** project
3. Go to: **Settings** → **Environment Variables**
4. Add new variable:
   - Name: `HUGGINGFACE_API_KEY`
   - Value: `hf_xxxxxxxxxxxxxxxxxxxxx` (your token)
5. Click **Save**
6. Redeploy the project

## 🚀 What You Get

### Free Features:

✅ **Unlimited image generations** (with rate limits)
✅ **Stable Diffusion 2.1** - Professional quality
✅ **512x512 images** - High resolution
✅ **No credit card** - Ever!
✅ **Commercial use** - Allowed!

### Rate Limits (FREE Tier):

- ~1000 requests per hour
- If you hit the limit, wait 5 minutes and try again
- More than enough for a SaaS MVP!

## 🎨 Models Available (All FREE!)

Your app currently uses: **`stabilityai/stable-diffusion-2-1`**

Want to try others? Change the URL in `server/controllers/aiController.js`:

```javascript
// Current (Stable Diffusion 2.1)
const HF_API_URL =
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";

// Alternative: Stable Diffusion 1.5 (faster)
const HF_API_URL =
  "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";

// Alternative: Dreamlike Art (artistic style)
const HF_API_URL =
  "https://api-inference.huggingface.co/models/dreamlike-art/dreamlike-photoreal-2.0";
```

## 🔥 No More Paid APIs!

### Before (ClipDrop):

- ❌ Required payment
- ❌ Limited free credits
- ❌ Expensive after trial

### Now (Hugging Face):

- ✅ Completely FREE forever
- ✅ No credit card needed
- ✅ Generous rate limits
- ✅ Professional quality

## 📚 Documentation

- API Docs: https://huggingface.co/docs/api-inference
- Stable Diffusion: https://huggingface.co/stabilityai/stable-diffusion-2-1
- Rate Limits: https://huggingface.co/docs/api-inference/rate-limits

## 🎉 Ready to Use!

After adding your token:

1. Restart your server: `cd server && npm start`
2. Test image generation in your app
3. Deploy to Vercel with the environment variable

**Everything is now 100% FREE!** 🚀
