import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

export const GET = async (req: Request) => {
    const { userId, friendId } = req.url.split('?')[1]
        .split('&')
        .reduce((acc, curr) => {
            const [key, value] = curr.split('=');
            acc[key as 'userId' | 'friendId'] = parseInt(value);
            return acc;
        }, {} as { userId: number; friendId: number });

    try {
        // Check if there is a block entry for either user
        const blockStatus = await client.block.findFirst({
            where: {
                OR: [
                    { blockerId: userId, blockedId: friendId }, // userId blocked friendId
                    { blockerId: friendId, blockedId: userId }, // friendId blocked userId
                ],
            },
        });

        const isBlocked = !!blockStatus; // True if there's any block entry
        const isBlockingUser = blockStatus?.blockerId === userId && blockStatus?.blockedId === friendId; // userId is blocking friendId
        const isBlockedByUser = blockStatus?.blockerId === friendId && blockStatus?.blockedId === userId; // friendId is blocking userId

        return new Response(JSON.stringify({
            isBlocked: isBlocked,
            isBlockingUser,
            isBlockedByUser,
            friendshipStatus: null, // You might not need this anymore
        }), { status: 200 });
    } catch (error) {
        console.error('Error fetching friendship status:', error);
        return new Response(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
    }
};
