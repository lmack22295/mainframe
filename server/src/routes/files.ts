import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadLimiter } from '../middleware/rateLimiter';
import { validateFileType, validateFileSize, sanitizeFilename, validatePath } from '../middleware/security';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = sanitizeFilename(file.originalname);
    const ext = path.extname(sanitizedName);
    const name = path.basename(sanitizedName, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.txt', '.md', '.js', '.ts', '.json', '.csv', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

router.post('/upload',
  uploadLimiter,
  upload.single('file'),
  validateFileType(['.txt', '.md', '.js', '.ts', '.json', '.csv', '.pdf']),
  validateFileSize(10 * 1024 * 1024), // 10MB
  (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    });
  }

  res.json({
    success: true,
    data: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    }
  });
});

router.get('/', validatePath, (req, res) => {
  const { path: dirPath } = req.query;
  const targetPath = dirPath ? String(dirPath) : process.cwd();

  try {
    const items = fs.readdirSync(targetPath, { withFileTypes: true });
    const fileList = items.map(item => ({
      name: item.name,
      isDirectory: item.isDirectory(),
      path: path.join(targetPath, item.name)
    }));

    res.json({
      success: true,
      data: {
        currentPath: targetPath,
        items: fileList
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid path'
    });
  }
});

export default router;