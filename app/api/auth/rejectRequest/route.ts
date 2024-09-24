// pages/api/auth/rejectRequest.ts

import { PrismaClient } from "@prisma/client";

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
        // Find the friendship request
        const friendshipRequest = await client.friendship.findUnique({
            where: { id: Number(requestId) },
        });

        if (!friendshipRequest) {
            return new Response(JSON.stringify({ error: "Friendship request not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Check if the user is the receiver of the request
        if (friendshipRequest.receiverId !== Number(userId)) {
            return new Response(JSON.stringify({ error: "You are not authorized to reject this request" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Delete the friendship request
        await client.friendship.delete({
            where: { id: Number(requestId) },
        });

        return new Response(JSON.stringify({ message: "Friendship request rejected" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
