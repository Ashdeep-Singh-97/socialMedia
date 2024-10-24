import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
  const { email, content } = await req.json();

  if (!email || !content) {
    return NextResponse.json({ message: 'Email and comment content are required' }, { status: 400 });
  }

  try {
    // Fetch the user ID based on the email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(params.postId) },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Create the comment using the user ID
    await prisma.comment.create({
      data: {
        content,
        postId: Number(params.postId),
        authorId: user.id, // Use the fetched user ID here
      },
    });

    return NextResponse.json({ message: 'Comment added successfully' });
  } catch (error) {
    // Type narrowing for `error`
    if (error instanceof Error) {
      console.error('Error adding the comment:', error);
      return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
    }
  }
}
