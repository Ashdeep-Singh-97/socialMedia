import { PrismaClient } from "@prisma/client";

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
    // Fetch the user and include their friends directly
    const userWithFriends = await client.user.findUnique({
      where: { id: Number(userId) },
      include: {
        friends: true, // Directly include the friends
      },
    });

    const friendList = userWithFriends?.friends.map(friend => ({
      id: friend.id,
      username: friend.username,
      email: friend.email,
      profileImageUrl: friend.profileImageUrl,
    })) || [];

    return new Response(JSON.stringify(friendList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
