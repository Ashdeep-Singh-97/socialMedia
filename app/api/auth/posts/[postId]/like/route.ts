import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    // Fetch the user based on the email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(params.postId) },
      include: { likes: true },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const existingLike = post.likes.find((like) => like.userId === user.id);
    if (existingLike) {
      return NextResponse.json({ message: 'You have already liked this post.' }, { status: 400 });
    }

    // Create the like using the user ID
    await prisma.like.create({
      data: {
        postId: Number(params.postId),
        userId: user.id, // Use the fetched user ID here
      },
    });

    return NextResponse.json({ message: 'Post liked successfully' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error liking the post:', error);
      return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
    }
  }
}
