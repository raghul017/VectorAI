# 🚀 Vector.AI - AI-Powered Content Creation Platform

<div align="center">

![Vector.AI](https://img.shields.io/badge/Vector.AI-AI%20SaaS%20Platform-8B5CF6?style=for-the-badge)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Try_Now-success?style=for-the-badge)](https://vectorai-inky.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**A modern, full-stack AI SaaS application that empowers users to create content, generate stunning images, and enhance digital assets using cutting-edge artificial intelligence.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 👨‍💻 Developer

**Built with ❤️ by [Raghul AR](https://github.com/raghul017)**

<div align="left">

[![Email](https://img.shields.io/badge/Email-arraghul6%40gmail.com-D14836?style=flat-square&logo=gmail)](mailto:arraghul6@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-raghul--ar05-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/raghul-ar05/)
[![Portfolio](https://img.shields.io/badge/Portfolio-raghul017.github.io-000000?style=flat-square&logo=github)](https://raghul017.github.io)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Installation](#-installation)
- [🔐 Environment Variables](#-environment-variables)
- [🏃‍♂️ Usage](#️-usage)
- [🛠 API Endpoints](#-api-endpoints)
- [🗄 Database Schema](#-database-schema)
- [🎯 Key Features](#-key-features-explained)
- [🔧 Development](#-development)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Core AI Tools

| Tool | Description | Technology |
|------|-------------|------------|
| **🖊️ AI Article Writer** | Generate high-quality articles (500-1600+ words) with customizable length | Google Gemini 2.0 Flash |
| **#️⃣ Blog Title Generator** | Create SEO-optimized titles across 8 categories | Google Gemini 2.0 Flash |
| **🎨 AI Image Generation** | Produce stunning images with multiple artistic styles | Hugging Face FLUX.1-schnell |
| **🖼️ Background Removal** | Automatically remove backgrounds using AI | ClipDrop API |
| **✂️ Object Removal** | Seamlessly erase unwanted objects | ClipDrop API |
| **📄 Resume Reviewer** | Get AI-driven feedback to improve resumes | Google Gemini + PDF Parse |

### 👥 User Experience

- ✅ **Secure Authentication** - Clerk-powered user management
- 📊 **Personal Dashboard** - Centralized workspace for all creations
- 🌐 **Community Gallery** - Share and discover AI-generated content
- ❤️ **Engagement System** - Like and interact with community creations
- 🆓 **Free Tier** - No credit card required, generous limits
- 🌑 **Dark Theme** - Sleek interface with glassmorphic design
- ✨ **Smooth Animations** - Professional Dribbble-quality micro-animations
- 🧭 **Floating Navigation** - Modern glassmorphic navbar
- 📱 **Fully Responsive** - Seamless experience across all devices

### 🔧 Technical Features

- ⚡ **Lightning Fast** - Vite 7 for instant HMR and builds
- 🎨 **Modern UI** - Tailwind CSS 4.1 with custom animations
- 🔔 **Real-time Feedback** - Toast notifications for all actions
- 📤 **File Upload** - Secure image and PDF handling with Multer 2.0
- 💾 **Content Management** - Publish/unpublish creations
- 🗄️ **Database Persistence** - PostgreSQL with indexes for performance
- 🎭 **Glassmorphic Design** - Backdrop blur with subtle borders
- 🎬 **Advanced Animations** - Cubic-bezier easing, staggered reveals
- 🚀 **Optimized Performance** - Code splitting and lazy loading

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1 | Modern UI library with latest features |
| **Vite** | 7.0 | Next-generation build tool |
| **React Router DOM** | 7.7 | Client-side routing |
| **Tailwind CSS** | 4.1 | Utility-first CSS framework |
| **@tailwindcss/vite** | 4.1 | Tailwind Vite plugin |
| **Axios** | 1.10 | HTTP client |
| **Lucide React** | 0.525 | Modern icon library |
| **React Hot Toast** | 2.5 | Toast notifications |
| **React Markdown** | 10.1 | Markdown rendering |
| **Clerk** | 5.35 | Authentication & user management |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | JavaScript runtime |
| **Express.js** | 5.1 | Web application framework |
| **@neondatabase/serverless** | 1.0 | Serverless PostgreSQL client |
| **@clerk/express** | 1.7 | Authentication middleware |
| **Cloudinary** | 2.7 | Image storage & processing |
| **Multer** | 2.0 | File upload handling |
| **@google/generative-ai** | 0.24 | Google Gemini API |
| **Axios** | 1.10 | HTTP client for API calls |
| **PDF Parse** | 1.1 | PDF processing |
| **Form Data** | 4.0 | Multipart form data |
| **CORS** | 2.8 | Cross-origin resource sharing |
| **Dotenv** | 17.2 | Environment variables |

### AI Services

| Service | Model | Use Case |
|---------|-------|----------|
| **Google Gemini** | gemini-2.0-flash-exp | Article & blog title generation |
| **Hugging Face** | FLUX.1-schnell | High-quality image generation |
| **ClipDrop API** | - | Background & object removal |

### Database & Storage

- **Neon PostgreSQL** - Serverless PostgreSQL with `@neondatabase/serverless`
- **Cloudinary** - Cloud-based image and video management

### Development Tools

- **ESLint** - 9.30 - Code linting and quality
- **Nodemon** - 3.1 - Auto-restart development server
- **@vitejs/plugin-react** - 4.6 - React Fast Refresh

---

## 📁 Project Structure

```
VectorAI/AI-SaaS/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, icons, data
│   │   │   ├── logo.svg
│   │   │   ├── assets.js            # Asset exports & tool data
│   │   │   └── ...
│   │   ├── components/              # Reusable UI components
│   │   │   ├── AiTools.jsx          # AI tools showcase grid
│   │   │   ├── AiToolsGSAP.jsx      # GSAP animated version
│   │   │   ├── CreationItem.jsx     # Individual creation card
│   │   │   ├── Footer.jsx           # Site footer with links
│   │   │   ├── Hero.jsx             # Landing page hero section
│   │   │   ├── HeroGSAP.jsx         # GSAP animated hero
│   │   │   ├── Navbar.jsx           # Floating glassmorphic navbar
│   │   │   ├── Plan.jsx             # Pricing plans
│   │   │   ├── Sidebar.jsx          # Dashboard sidebar navigation
│   │   │   └── Testimonial.jsx      # User testimonials
│   │   ├── pages/                   # Application pages
│   │   │   ├── BlogTitles.jsx       # Blog title generator page
│   │   │   ├── Community.jsx        # Community gallery page
│   │   │   ├── DashBoard.jsx        # User dashboard
│   │   │   ├── GenerateImages.jsx   # AI image generation
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Layout.jsx           # App layout wrapper
│   │   │   ├── RemoveBackground.jsx # Background removal tool
│   │   │   ├── RemoveObject.jsx     # Object removal tool
│   │   │   ├── ReviewResume.jsx     # Resume review tool
│   │   │   └── WriteArticle.jsx     # Article generation
│   │   ├── App.jsx                  # Main app component
│   │   ├── index.css                # Global styles & animations
│   │   └── main.jsx                 # App entry point
│   ├── .env                         # Environment variables
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vercel.json                  # Vercel deployment config
│   └── vite.config.js               # Vite configuration
├── server/                          # Backend Express application
│   ├── configs/                     # Configuration files
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   ├── db.js                    # Neon database connection
│   │   └── multer.js                # File upload configuration
│   ├── controllers/                 # Route controllers
│   │   ├── aiController.js          # AI endpoints logic
│   │   └── userController.js        # User endpoints logic
│   ├── middlewares/                 # Custom middleware
│   │   └── auth.js                  # Clerk authentication
│   ├── routes/                      # API routes
│   │   ├── aiRoutes.js              # AI tool routes
│   │   └── userRoutes.js            # User routes
│   ├── .env                         # Environment variables
│   ├── database_schema.sql          # PostgreSQL schema
│   ├── package.json                 # Backend dependencies
│   ├── server.js                    # Express server setup
│   └── vercel.json                  # Vercel serverless config
├── HUGGINGFACE_SETUP.md             # Hugging Face setup guide
├── IMAGE_MODELS_GUIDE.md            # Image model comparison
├── RATE_LIMIT_INFO.md               # API rate limits info
└── README.md                        # Project documentation
```

---

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Required API Keys & Accounts

| Service | Purpose | Sign Up Link |
|---------|---------|--------------|
| **Clerk** | Authentication & user management | [clerk.com](https://clerk.com) |
| **Neon** | Serverless PostgreSQL database | [neon.tech](https://neon.tech) |
| **Cloudinary** | Image storage & processing | [cloudinary.com](https://cloudinary.com) |
| **Google AI Studio** | Gemini API for text generation | [ai.google.dev](https://ai.google.dev) |
| **Hugging Face** | FLUX.1 image generation model | [huggingface.co](https://huggingface.co) |
| **ClipDrop** | Background & object removal | [clipdrop.co](https://clipdrop.co) |

> **Note:** All services offer free tiers! See [HUGGINGFACE_SETUP.md](HUGGINGFACE_SETUP.md) for detailed setup instructions.

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/raghul017/VectorAI.git
cd VectorAI/AI-SaaS
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

### 4. Set Up Database

1. Create a Neon PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Run the SQL schema:

```bash
# Copy the contents of server/database_schema.sql
# Paste and execute in Neon's SQL Editor
```

---

## 🔐 Environment Variables

### Frontend (`.env` in `client/` folder)

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx

# Backend API URL
VITE_BASE_URL=http://localhost:3000
# For production:
# VITE_BASE_URL=https://your-backend-url.vercel.app
```

### Backend (`.env` in `server/` folder)

```env
# Database Connection
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# AI Services
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
CLIPDROP_API_KEY=xxxxxxxxxxxxxxxxxxxxx

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxx

# Server Configuration
PORT=3000
NODE_ENV=development
```

> **💡 Tip:** See [HUGGINGFACE_SETUP.md](HUGGINGFACE_SETUP.md) for detailed API key setup instructions.

---

## 🏃‍♂️ Usage

### Development Mode

1. **Start the Backend Server:**

```bash
cd server
npm run server
```

Server runs on: `http://localhost:3000`

2. **Start the Frontend Development Server:**

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Production Build

1. **Build the Frontend:**

```bash
cd client
npm run build
```

2. **Start the Production Server:**

```bash
cd server
npm start
```

### Deployment

#### Frontend (Vercel)

```bash
cd client
vercel --prod
```

#### Backend (Vercel Serverless)

```bash
cd server
vercel --prod
```

---

## 🛠 API Endpoints

### AI Endpoints (`/api/ai`)

| Method | Endpoint | Description | Request Body | Auth |
|--------|----------|-------------|--------------|------|
| POST | `/generate-article` | Generate AI articles | `{ prompt, length }` | ✅ |
| POST | `/generate-blog-title` | Generate blog titles | `{ prompt, category }` | ✅ |
| POST | `/generate-images` | Generate AI images | `{ prompt, style, publish }` | ✅ |
| POST | `/remove-background` | Remove image background | `FormData: image` | ✅ |
| POST | `/remove-image-object` | Remove objects from image | `FormData: image` | ✅ |
| POST | `/resume-review` | Review and analyze resume | `FormData: resume` | ✅ |

### User Endpoints (`/api/user`)

| Method | Endpoint | Description | Response | Auth |
|--------|----------|-------------|----------|------|
| GET | `/get-user-creations` | Fetch user's creations | `{ creations: [] }` | ✅ |
| GET | `/get-published-creations` | Fetch community posts | `{ creations: [] }` | ✅ |
| POST | `/toggle-like-creation` | Like/unlike creation | `{ success, message }` | ✅ |

---

## 🗄 Database Schema

### Creations Table

```sql
CREATE TABLE creations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,         -- 'article', 'blog-title', 'image'
  publish BOOLEAN DEFAULT FALSE,
  likes TEXT[] DEFAULT '{}',         -- Array of user IDs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_creations_user_id ON creations(user_id);
CREATE INDEX idx_creations_type ON creations(type);
CREATE INDEX idx_creations_publish ON creations(publish);
CREATE INDEX idx_creations_created_at ON creations(created_at);
```

**Auto-update trigger:**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_creations_updated_at 
    BEFORE UPDATE ON creations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 🎯 Key Features Explained

### 🖊️ AI Article Writer

- **Model:** Google Gemini 2.0 Flash (Latest & Fastest)
- **Word Count:** 500 to 1600+ words
- **Features:**
  - Customizable prompts and topics
  - Markdown formatting support
  - Instant preview and editing
  - Database persistence
  - Community sharing option

### #️⃣ Blog Title Generator

- **Categories:** General, Technology, Health, Lifestyle, Travel, Food, Education, Business
- **Features:**
  - SEO-optimized suggestions
  - Multiple title variations per request
  - Category-specific optimization
  - Save favorites to dashboard

### 🎨 AI Image Generation

- **Model:** Hugging Face FLUX.1-schnell (Best Free Model)
- **Features:**
  - Multiple artistic styles (Realistic, Ghibli, Cartoon, Anime, Fantasy, 3D, Portrait)
  - High-quality output (142KB average file size)
  - Fast generation (2-4 seconds)
  - Cloudinary storage integration
  - Community gallery sharing
  - Daily limit: 15 images (free tier)

> **Why FLUX.1-schnell?** Tested against 10+ models, produces highest quality free images with photorealistic results.

### 🖼️ Background Removal

- **Technology:** ClipDrop API
- **Features:**
  - AI-powered precision removal
  - Support for JPG, PNG formats
  - Real-time processing feedback
  - One-click download
  - Save to dashboard

### ✂️ Object Removal

- **Technology:** ClipDrop API
- **Features:**
  - Seamless object erasure
  - Content-aware fill
  - Professional results
  - Instant preview

### 📄 Resume Reviewer

- **Technology:** Google Gemini + PDF Parse
- **Features:**
  - PDF upload support
  - Comprehensive feedback
  - ATS optimization tips
  - Improvement suggestions
  - Formatting analysis

---

## 🔧 Development

### Frontend Scripts

```bash
npm run dev      # Start Vite development server with HMR
npm run build    # Build for production with optimizations
npm run preview  # Preview production build locally
npm run lint     # Run ESLint for code quality
```

### Backend Scripts

```bash
npm run server   # Start with nodemon (auto-restart on changes)
npm start        # Start production server
```

### Code Quality

- **ESLint 9** - Configured with React and modern JS rules
- **Prettier** - Code formatting (configured in Tailwind CSS)
- **Git Hooks** - Pre-commit linting (optional setup)

---

## 📚 Documentation

Additional documentation files in the repository:

- **[HUGGINGFACE_SETUP.md](HUGGINGFACE_SETUP.md)** - Complete guide to setting up FREE Hugging Face API
- **[IMAGE_MODELS_GUIDE.md](IMAGE_MODELS_GUIDE.md)** - Comparison of 10+ image generation models
- **[RATE_LIMIT_INFO.md](RATE_LIMIT_INFO.md)** - API rate limits and best practices

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**

```bash
git clone https://github.com/YOUR_USERNAME/VectorAI.git
```

2. **Create your feature branch**

```bash
git checkout -b feature/AmazingFeature
```

3. **Commit your changes**

```bash
git commit -m 'Add some AmazingFeature'
```

4. **Push to the branch**

```bash
git push origin feature/AmazingFeature
```

5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style (ESLint rules)
- Write meaningful commit messages
- Update documentation for new features
- Test thoroughly before submitting PR
- Add comments for complex logic

---

## 📞 Support

Need help? Reach out through any of these channels:

- 📧 **Email:** [arraghul6@gmail.com](mailto:arraghul6@gmail.com)
- 💼 **LinkedIn:** [Raghul AR](https://www.linkedin.com/in/raghul-ar05/)
- 🐙 **GitHub Issues:** [Create an issue](https://github.com/raghul017/VectorAI/issues)
- 🌐 **Portfolio:** [raghul017.github.io](https://raghul017.github.io)

---

## 🙏 Acknowledgments

Special thanks to these amazing services and technologies:

- **[Clerk](https://clerk.com)** - Seamless authentication and user management
- **[Google AI](https://ai.google.dev)** - Powerful Gemini 2.0 Flash model
- **[Hugging Face](https://huggingface.co)** - Free FLUX.1-schnell image generation
- **[ClipDrop](https://clipdrop.co)** - Professional image editing APIs
- **[Cloudinary](https://cloudinary.com)** - Reliable cloud image processing
- **[Neon](https://neon.tech)** - Serverless PostgreSQL database
- **[Vercel](https://vercel.com)** - Seamless deployment platform
- **[Tailwind CSS](https://tailwindcss.com)** - Beautiful utility-first CSS
- **[Lucide Icons](https://lucide.dev)** - Modern icon library
- **[React](https://react.dev)** - The best UI library

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Raghul AR

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

## ⭐ Star this Repository

If you find this project useful, please consider giving it a star! ⭐

**Built with ❤️ by [Raghul AR](https://github.com/raghul017)**

[![Email](https://img.shields.io/badge/Email-arraghul6%40gmail.com-D14836?style=flat-square&logo=gmail)](mailto:arraghul6@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-raghul--ar05-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/raghul-ar05/)
[![Portfolio](https://img.shields.io/badge/Portfolio-raghul017.github.io-000000?style=flat-square&logo=github)](https://raghul017.github.io)

---

**[⬆ Back to Top](#-vectorai---ai-powered-content-creation-platform)**

</div>
