import { PrismaClient, FriendshipStatus } from "@prisma/client";

const client = new PrismaClient();

export async function POST(req: Request) {
  const { userId, receiverId } = await req.json();
  console.log("userId , " , userId);
  console.log("receiverId , " , receiverId);

  if (!userId || !receiverId) {
    return new Response(JSON.stringify({ error: "User ID and Receiver ID are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Check if the friendship request already exists
    const existingRequest = await client.friendship.findFirst({
      where: {
        OR: [
          {
            senderId: Number(userId),
            receiverId: Number(receiverId),
          },
          {
            senderId: Number(receiverId),
            receiverId: Number(userId),
          },
        ],
      },
    });

    if (existingRequest) {
      return new Response(JSON.stringify({ error: "Friend request already sent" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create the friendship request
    const friendshipRequest = await client.friendship.create({
      data: {
        senderId: Number(userId),
        receiverId: Number(receiverId),
        status: FriendshipStatus.PENDING,
      },
    });

    return new Response(JSON.stringify(friendshipRequest), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
