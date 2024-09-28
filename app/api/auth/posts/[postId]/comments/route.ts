// /api/auth/posts/[postId]/comments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(params.postId) },
      include: { author: { select: { username: true } } }, // Include the author's username
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
