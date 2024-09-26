import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { content, senderId, receiverId } = await req.json();

    // Validate the input
    if (!content || !senderId || !receiverId) {
        return NextResponse.json({ error: 'Content, senderId, and receiverId are required.' }, { status: 400 });
    }

    try {
        // Create a new message
        const message = await prisma.message.create({
            data: {
                content,
                senderId: parseInt(senderId),
                receiverId: parseInt(receiverId),
            },
        });

        return NextResponse.json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'An error occurred while sending the message.' }, { status: 500 });
    }
}
