import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient(); // Adjust the import based on your project structure

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Fetch user data including the profile image URL and posts
        const user = await client.user.findUnique({
            where: { id: Number(userId) },
            include: {
                posts: {
                    orderBy: { createdAt: 'desc' }, // Order posts by creation date
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Format the response
        const response = {
            profileImageUrl: user.profileImageUrl || null, // Return the profile image URL or null
            posts: user.posts.map(post => ({
                id: post.id,
                content: post.content,
                imageUrl: post.imageUrl || null, // Return the post image URL or null
                createdAt: post.createdAt.toISOString(), // Ensure date is in ISO format
            })),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/auth/profile
export async function PUT(request: Request) {
    const userId = request.headers.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { profileImageUrl } = await request.json();

    if (!profileImageUrl) {
        return NextResponse.json({ error: 'Profile image URL is required' }, { status: 400 });
    }

    try {
        const updatedUser = await client.user.update({
            where: { id: Number(userId) },
            data: { profileImageUrl },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile image:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
