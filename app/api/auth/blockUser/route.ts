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

        if (friendship) {
            await client.$transaction(async (prisma) => {
                await prisma.friendship.update({
                    where: { id: friendship.id },
                    data: { status: 'BLOCKED' },
                });
                await prisma.block.create({
                    data: {
                        blockerId: userId,
                        blockedId: friendId,
                    },
                });
            });
            return new Response(JSON.stringify({ message: 'User has been blocked.' }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: 'No friendship found to block.' }), { status: 404 });
        }
    } catch (error) {
        console.error('Error blocking user:', error);
        return new Response(JSON.stringify({ error: 'An error occurred while blocking the user.' }), { status: 500 });
    }
};
