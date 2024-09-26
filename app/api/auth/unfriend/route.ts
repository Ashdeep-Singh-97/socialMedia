import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { userId, friendId } = await req.json();

    console.log("userId " , userId);
    console.log("FriendId " , friendId);

    if (!userId || !friendId) {
        return NextResponse.json({ error: 'User ID and Friend ID are required.' }, { status: 400 });
    }

    try {

        // Disconnect friendId from userId
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: {
                friends: {
                    disconnect: { id: parseInt(friendId) }
                }
            }
        });

        // Disconnect userId from friendId
        await prisma.user.update({
            where: { id: parseInt(friendId) },
            data: {
                friends: {
                    disconnect: { id: parseInt(userId) }
                }
            }
        });

        return NextResponse.json({ message: 'Unfriended successfully.' });
    } catch (error) {
        console.error('Error unfriending:', error);
        return NextResponse.json({ error: 'An error occurred while unfriending.' }, { status: 500 });
    }
}
