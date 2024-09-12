import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(req : NextRequest){

    const body = await req.json();

    console.log(body);

    const entry = await client.user.create({
        data : {
            email : body.email,
            password : body.password
        }
    })

    console.log(entry);

    return Response.json({
        message : "you are logged in"
    });
}
