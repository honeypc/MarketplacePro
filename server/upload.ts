import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store uploads in the public/uploads directory
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// File filter to only allow images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'));
  }
};

// Configure upload middleware
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10 // Maximum 10 files per upload
  }
});

// Helper function to generate image URL
export const getImageUrl = (filename: string, req: Request): string => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${filename}`;
};