import { PrismaClient, FriendshipStatus } from "@prisma/client";

const client = new PrismaClient();

export async function POST(req: Request) {
    const { userId, requestId } = await req.json();

    if (!userId || !requestId) {
        return new Response(JSON.stringify({ error: "User ID and Request ID are required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const friendship = await client.friendship.findUnique({
            where: { id: Number(requestId) },
        });

        if (!friendship) {
            return new Response(JSON.stringify({ error: "Friendship request not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const senderId = friendship.senderId;
        const receiverId = friendship.receiverId;

        // Use a transaction to ensure atomic updates
        await client.$transaction([
            // Update the friendship status to accepted
            client.friendship.update({
                where: { id: Number(requestId) },
                data: { status: FriendshipStatus.ACCEPTED },
            }),
            // Update sender's friend list
            client.user.update({
                where: { id: Number(senderId) },
                data: {
                    friends: {
                        connect: { id: Number(receiverId) },
                    },
                },
            }),
            // Update receiver's friend list
            client.user.update({
                where: { id: Number(receiverId) },
                data: {
                    friends: {
                        connect: { id: Number(senderId) },
                    },
                },
            }),
            client.user.update({
                where: { id: Number(senderId) },
                data: {
                    sentRequests: {
                        delete: { id: Number(requestId) },
                    },
                },
            }),
        ]);

        return new Response(JSON.stringify({ message: "Friend request accepted" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error accepting friend request:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
