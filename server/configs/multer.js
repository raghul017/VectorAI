import multer from 'multer';

// Use memory storage for Vercel serverless compatibility
// Disk storage doesn't work reliably with Vercel's ephemeral filesystem
const storage = multer.memoryStorage();

// File size limits to prevent Vercel 403 errors
// Vercel serverless functions have 4.5MB request body limit
const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB limit (safe margin under 4.5MB)
  },
  fileFilter: (req, file, cb) => {
    // Allow only images and PDFs
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images (JPEG, PNG, WebP, GIF) and PDFs are allowed.'));
    }
  }
});

export { upload };