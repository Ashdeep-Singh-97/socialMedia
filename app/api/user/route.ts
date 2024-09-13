import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'; // Ensure you have bcrypt installed
import jwt from 'jsonwebtoken'; // Ensure you have jsonwebtoken installed

const client = new PrismaClient();

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { action, email, password } = body;

    if (action === 'signup') {
        // Handle user signup
        const existingUser = await client.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await client.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        console.log('User created:', newUser);

        const token = jwt.sign({ userId: newUser.id }, 'your_jwt_secret');

        return NextResponse.json(token);
    } else if (action === 'signin') {
        // Handle user signin
        const user = await client.user.findUnique({
            where: { email }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret');

        return NextResponse.json(token);
    } else {
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
}
