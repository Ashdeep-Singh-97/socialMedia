import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const friendId = searchParams.get('friendId');
    
    console.log("userId , " , userId);
    console.log("friendId , " , friendId);

    if (!userId || !friendId) {
        return NextResponse.json({ error: 'User ID and Friend ID are required.' }, { status: 400 });
    }

    try {
        const chatHistory = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: parseInt(userId), receiverId: parseInt(friendId) },
                    { senderId: parseInt(friendId), receiverId: parseInt(userId) }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return NextResponse.json(chatHistory);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return NextResponse.json({ error: 'An error occurred while fetching chat history.' }, { status: 500 });
    }
}
