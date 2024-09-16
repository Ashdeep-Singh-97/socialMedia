import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'; // Ensure you have bcrypt installed
import jwt from 'jsonwebtoken'; // Ensure you have jsonwebtoken installed
import { validateUser } from "@/app/zod"; // Adjust this import based on your validation logic

const client = new PrismaClient();

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { valid, errors } = await validateUser(body);

    if (!valid) {
        console.log("Validation failed route.ts : line 14", { errors });
        return NextResponse.json({ errors }, { status: 400 });
    }

    const { action, username, email, identifier, password } = body; // Use appropriate fields

    if (action === 'signup') {
        // Handle user signup
        const existingUser = await client.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await client.user.create({
            data: {
                email, // Save email only if it is an email
                username, // Save username only if it is a username
                password: hashedPassword
            }
        });

        console.log('User created:', newUser);

        const token = jwt.sign({ userId: newUser.id }, 'your_jwt_secret'); // Added expiration for security
        console.log("route.ts 42", token);
        return NextResponse.json({ token, username: newUser.username, email: newUser.email });
    } else if (action === 'signin') {
        // Handle user signin
        const user = await client.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret'); // Added expiration for security

        return NextResponse.json({ token, username: user.username, email: user.email });
    } else {
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
}
