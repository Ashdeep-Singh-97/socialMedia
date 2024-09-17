// pages/api/auth/post.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// API Route Handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create a new instance of IncomingForm
  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true, // Keep file extensions
    // Optionally, set the max file size (default: 100MB)
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  // Parse the form data
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const content = fields.content as unknown as string;
    const authorId = fields.authorId as unknown as string;
    const image = files.image as formidable.File[];

    if (!content || !authorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Handle file upload, if any
      const imagePath = image[0]?.filepath;

      // Handle saving post to database (pseudo code)
      // await savePostToDatabase({ content, authorId, imagePath });

      return res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error('Error handling post creation:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
