// /app/api/auth/unblockUser/route.ts

import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export const POST = async (req: Request) => {
    const { userId, friendId } = await req.json();

    if (!userId || !friendId) {
        return new Response(JSON.stringify({ error: 'User ID and Friend ID are required' }), { status: 400 });
    }

    try {
        const friendship = await client.friendship.findFirst({
            where: {
                OR: [
                    { senderId: userId, receiverId: friendId },
                    { senderId: friendId, receiverId: userId },
                ],
            },
        });
        
        const block = await client.block.findFirst({
            where: {
                     blockerId: userId, blockedId: friendId 
            },
        });
        if (friendship && friendship.status === 'BLOCKED' && block) {
            await client.friendship.update({
                where: { id: friendship.id },
                data: { status: 'ACCEPTED' }, // or another appropriate status
            });
            await client.block.deleteMany({
                where: {
                    blockerId: userId,
                    blockedId: friendId,
                },
            });
            return new Response(JSON.stringify({ message: 'User has been unblocked.' }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: 'No blocked friendship found.' }), { status: 400 });
        }
    } catch (error) {
        console.error('Error unblocking user:', error);
        return new Response(JSON.stringify({ error: 'An error occurred while unblocking the user.' }), { status: 500 });
    }
};
