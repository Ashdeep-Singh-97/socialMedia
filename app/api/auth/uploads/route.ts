// app/api/auth/uploads/route.ts

import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/app/lib/cloudinary';
import Busboy from 'busboy';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  return new Promise<NextResponse>((resolve, reject) => {
    const busboy = new Busboy({ headers: req.headers });
    let imageUrl: string | null = null;

    busboy.on('file', (fieldname: any, file: { pipe: (arg0: any) => void; resume: () => void; }, filename: any, encoding: any, mimetype: string) => {
      if (mimetype.startsWith('image/')) {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error: any, result: { secure_url: null; }) => {
            if (error) {
              reject(NextResponse.json({ error: 'Failed to upload image' }, { status: 500 }));
            } else {
              imageUrl = result?.secure_url || null;
            }
          }
        );

        // Pipe file stream to Cloudinary
        file.pipe(uploadStream);
      } else {
        file.resume(); // Skip non-image files
      }
    });

    busboy.on('finish', () => {
      if (imageUrl) {
        resolve(NextResponse.json({ imageUrl }, { status: 200 }));
      } else {
        resolve(NextResponse.json({ error: 'No image file uploaded' }, { status: 400 }));
      }
    });

    busboy.on('error', () => {
      reject(NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }));
    });

    req.pipe(busboy);
  });
}
