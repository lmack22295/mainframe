import { Request, Response, NextFunction } from 'express';
import path from 'path';

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
};

export const validateFileType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    const ext = path.extname(req.file.originalname).toLowerCase();

    if (!allowedTypes.includes(ext)) {
      return res.status(400).json({
        success: false,
        error: `File type ${ext} not allowed. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    next();
  };
};

export const validateFileSize = (maxSizeInBytes: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    if (req.file.size > maxSizeInBytes) {
      return res.status(400).json({
        success: false,
        error: `File too large. Maximum size: ${Math.round(maxSizeInBytes / 1024 / 1024)}MB`
      });
    }

    next();
  };
};

export const preventDirectoryTraversal = (filePath: string): boolean => {
  const normalizedPath = path.normalize(filePath);
  return !normalizedPath.includes('../') && !normalizedPath.startsWith('/');
};

export const validatePath = (req: Request, res: Response, next: NextFunction) => {
  const { path: queryPath } = req.query;

  if (queryPath && typeof queryPath === 'string') {
    if (!preventDirectoryTraversal(queryPath)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid path: directory traversal not allowed'
      });
    }
  }

  next();
};