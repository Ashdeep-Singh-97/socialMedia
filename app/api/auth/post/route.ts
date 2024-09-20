// app/api/auth/post/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(req: NextRequest) {
  const { content, authorId, imageUrl } = await req.json();

  try {
    const post = await client.post.create({
      data: {
        content,
        authorId: parseInt(authorId, 10),
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
