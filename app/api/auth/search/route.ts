import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(req: Request) {
  const { userId, searchTerm } = await req.json();
  // console.log(searchTerm);
  if (!searchTerm) {
    return new Response(JSON.stringify({ error: "Search term is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const users = await client.user.findMany({
      where: {
        username: {
          contains: searchTerm,
          mode: 'insensitive', // Make the search case-insensitive
        },
        id : {
          not: Number(userId), // Exclude the logged-in user from results
      },
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
