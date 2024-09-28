// pages/api/posts/index.ts

import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function GET(req: Request) {
  try {
    const posts = await client.post.findMany({
      include: {
        author: { select: { username: true } }, // Include author's username
        comments: true, // Optionally include comments
        likes: true,    // Optionally include likes
      },
    });
    
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({ error: "An error occurred while fetching posts." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.$disconnect(); // Ensure the client disconnects
  }
}
