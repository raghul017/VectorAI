# 🚀 Vector.AI - AI-Powered Content Creation Platform

A comprehensive full-stack AI SaaS application that empowers users to create content, generate images, and enhance their digital assets using cutting-edge artificial intelligence.

## 🌐 Live Demo

**🔗 [Try Vector.AI Live](https://vectorai-inky.vercel.app/)**

## 👨‍💻 Developer

**Built with ❤️ by [Raghul AR](https://github.com/raghul017)**

- 📧 Email: arraghul6@gmail.com
- 💼 LinkedIn: [linkedin.com/in/raghul-ar05](https://www.linkedin.com/in/raghul-ar05/)
- 🌐 Portfolio: [raghul017.github.io](https://raghul017.github.io)

## � Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core AI Tools

- **AI Article Writer**: Generate high-quality, engaging articles with customizable length (500-1600+ words)
- **Blog Title Generator**: Create catchy and SEO-optimized titles across 8 different categories
- **AI Image Generation**: Produce stunning images from text prompts with 8+ artistic styles
- **Background Removal**: Automatically remove backgrounds from images using AI
- **Object Removal**: Seamlessly erase unwanted objects from photos
- **Resume Reviewer**: Get AI-driven feedback and suggestions to improve your resume

### 👥 User Experience

- **Authentication**: Secure user management with Clerk
- **Dashboard**: Personal workspace to view all your AI creations
- **Community Gallery**: Share and discover AI-generated content from other users
- **Like System**: Engage with community content through likes
- **Usage Plans**: Free tier with limits + Premium unlimited access
- **Dark Theme**: Sleek dark mode interface with subtle glassmorphic design
- **Smooth Animations**: Professional Dribbble-quality micro-animations throughout
- **Floating Navigation**: Modern glassmorphic navbar with centered navigation pills
- **Responsive Design**: Seamless experience across all devices

### 🔧 Technical Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Feedback**: Toast notifications for all user actions
- **File Upload**: Secure image and PDF upload functionality
- **Content Management**: Publish/unpublish your creations
- **Database Persistence**: All creations are stored and retrievable
- **Glassmorphic UI**: Modern design with backdrop blur and subtle borders
- **Advanced Animations**: Cubic-bezier easing, staggered reveals, and hover effects
- **Optimized Performance**: Vite for fast builds and hot module replacement

## 🛠 Tech Stack

### Frontend

- **React 19.1** - Modern UI library with latest features
- **Vite 7** - Next-generation fast build tool and development server
- **React Router DOM 7** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first CSS framework with @tailwindcss/vite plugin
- **Axios 1.10** - HTTP client for API requests
- **Lucide React** - Beautiful and modern icon library
- **React Hot Toast** - Elegant toast notifications
- **React Markdown** - Markdown rendering support
- **Clerk 5.35** - Complete authentication and user management

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js 5.1** - Fast, minimalist web application framework
- **PostgreSQL** - Serverless database via Neon
- **Clerk Express 1.7** - Authentication middleware
- **Cloudinary 2.7** - Cloud-based image storage and processing
- **Multer 2.0** - Multipart/form-data file upload handling
- **Google Generative AI** - AI text generation (Gemini API)
- **Axios 1.10** - HTTP client for API calls
- **PDF Parse** - Resume and document processing
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment variable management

### Database & Storage

- **Neon PostgreSQL** - Serverless PostgreSQL database with `@neondatabase/serverless`
- **Cloudinary** - Cloud-based image and video management platform

### Development Tools

- **ESLint 9** - Code linting and formatting
- **Nodemon 3** - Auto-restart development server
- **Vite Plugin React** - React Fast Refresh and JSX support

## 📁 Project Structure

```
AI SaaS/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/            # Images, icons, and data
│   │   ├── components/        # Reusable UI components
│   │   │   ├── AiTools.jsx    # AI tools showcase
│   │   │   ├── CreationItem.jsx # Individual creation display
│   │   │   ├── Footer.jsx     # Site footer
│   │   │   ├── Hero.jsx       # Landing page hero
│   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   ├── Plan.jsx       # Pricing plans
│   │   │   ├── Sidebar.jsx    # Dashboard sidebar
│   │   │   └── Testimonial.jsx # User testimonials
│   │   ├── pages/             # Application pages
│   │   │   ├── BlogTitles.jsx # Blog title generator
│   │   │   ├── Community.jsx  # Community gallery
│   │   │   ├── DashBoard.jsx  # User dashboard
│   │   │   ├── GenerateImages.jsx # Image generation
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── Layout.jsx     # App layout wrapper
│   │   │   ├── RemoveBackground.jsx # Background removal
│   │   │   ├── RemoveObject.jsx # Object removal
│   │   │   ├── ReviewResume.jsx # Resume review
│   │   │   └── WriteArticle.jsx # Article generation
│   │   ├── App.jsx            # Main app component
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # App entry point
│   ├── .env                   # Environment variables
│   ├── package.json           # Dependencies and scripts
│   └── vite.config.js         # Vite configuration
├── server/                     # Backend Express application
│   ├── configs/               # Configuration files
│   │   ├── cloudinary.js      # Cloudinary setup
│   │   ├── db.js              # Database connection
│   │   └── multer.js          # File upload config
│   ├── controllers/           # Route controllers
│   │   ├── aiController.js    # AI-related endpoints
│   │   └── userController.js  # User-related endpoints
│   ├── middlewares/           # Custom middleware
│   │   └── auth.js            # Authentication middleware
│   ├── routes/                # API routes
│   │   ├── aiRoutes.js        # AI endpoints routing
│   │   └── userRoutes.js      # User endpoints routing
│   ├── package.json           # Dependencies and scripts
│   └── server.js              # Express server setup
└── README.md                   # Project documentation
```

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher) or **yarn**
- **PostgreSQL database** (Neon serverless recommended)
- **Clerk account** for authentication ([clerk.com](https://clerk.com))
- **Cloudinary account** for image storage ([cloudinary.com](https://cloudinary.com))
- **Google Gemini API key** for AI text generation ([ai.google.dev](https://ai.google.dev))
- **ClipDrop API key** for AI image generation ([clipdrop.co](https://clipdrop.co))

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

## 🔐 Environment Variables

### Frontend (.env)

Create a `.env` file in the `client` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:3000
```

### Backend (.env)

Create a `.env` file in the `server` directory:

```env
# Database
DATABASE_URL=your_neon_postgresql_connection_string

# Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# AI Services
GEMINI_API_KEY=your_gemini_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server
PORT=3000
NODE_ENV=development
```

## 🏃‍♂️ Usage

### Development Mode

1. **Start the Backend Server**:

```bash
cd server
npm run server
```

2. **Start the Frontend Development Server**:

```bash
cd client
npm run dev
```

3. **Access the Application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

### Production Mode

1. **Build the Frontend**:

```bash
cd client
npm run build
```

2. **Start the Production Server**:

```bash
cd server
npm start
```

## 🛠 API Endpoints

### AI Endpoints (`/api/ai`)

| Method | Endpoint               | Description                          | Auth Required |
| ------ | ---------------------- | ------------------------------------ | ------------- |
| POST   | `/generate-article`    | Generate articles with custom length | ✅            |
| POST   | `/generate-blog-title` | Create blog titles by category       | ✅            |
| POST   | `/generate-images`     | Generate images from text prompts    | ✅            |
| POST   | `/remove-background`   | Remove image backgrounds             | ✅            |
| POST   | `/remove-image-object` | Remove objects from images           | ✅            |
| POST   | `/resume-review`       | Analyze and review resumes           | ✅            |

### User Endpoints (`/api/user`)

| Method | Endpoint                   | Description                      | Auth Required |
| ------ | -------------------------- | -------------------------------- | ------------- |
| GET    | `/get-user-creations`      | Fetch user's all creations       | ✅            |
| GET    | `/get-published-creations` | Fetch public community creations | ✅            |
| POST   | `/toggle-like-creation`    | Like/unlike community creations  | ✅            |

## 🗄 Database Schema

### Creations Table

```sql
CREATE TABLE creations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'article', 'blog-title', 'image'
  publish BOOLEAN DEFAULT false,
  likes TEXT[], -- Array of user IDs who liked
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Key Features Explained

### AI Article Writer

- Generate articles from 500 to 1600+ words
- Customizable prompts and topics
- Markdown formatting support
- Instant preview and editing

### Blog Title Generator

- 8 categories: General, Technology, Health, Lifestyle, Travel, Food, Education, Business
- SEO-optimized suggestions
- Multiple title variations per request

### AI Image Generation

- 8 artistic styles: Realistic, Ghibli, Cartoon, Anime, Fantasy, 3D, Portrait
- High-quality image output
- Cloudinary integration for storage
- Community sharing options

### Background & Object Removal

- AI-powered precision removal
- Support for JPG, PNG formats
- Real-time processing feedback
- Download and save functionality

### Community Features

- Public gallery of user creations
- Like and engagement system
- Real-time updates
- User authentication integration

## 🔧 Development

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Scripts

```bash
npm run server   # Start with nodemon (development)
npm start        # Start production server
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Clerk** for seamless authentication
- **OpenAI/Gemini** for powerful AI capabilities
- **Cloudinary** for reliable image processing
- **Neon** for serverless PostgreSQL
- **Tailwind CSS** for beautiful UI components

## 📞 Support

For support, email arraghul6@gmail.com or connect via [LinkedIn](https://www.linkedin.com/in/raghul-ar05/).

## 🙏 Acknowledgments

- **Clerk** for seamless authentication
- **OpenAI/Gemini** for powerful AI capabilities
- **Cloudinary** for reliable image processing
- **Neon** for serverless PostgreSQL
- **Tailwind CSS** for beautiful UI components
- **ClipDrop API** for advanced image generation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by [Raghul AR](https://github.com/raghul017)**

💼 [LinkedIn](https://www.linkedin.com/in/raghul-ar05/) • 🌐 [Portfolio](https://raghul017.github.io) • 📧 arraghul6@gmail.com
