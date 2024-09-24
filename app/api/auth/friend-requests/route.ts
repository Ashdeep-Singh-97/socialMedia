import { PrismaClient, FriendshipStatus } from "@prisma/client";

const client = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const requests = await client.friendship.findMany({
      where: { 
        receiverId: Number(userId), 
        status: FriendshipStatus.PENDING 
      },
      include: { sender: true },
    });
    const requestList = requests.map(request => ({
      id: request.id,
      senderId: request.sender.id,
      senderUsername: request.sender.username,
      senderEmail: request.sender.email,
    }));

    return new Response(JSON.stringify(requestList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
