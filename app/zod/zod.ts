// zod.ts

import { z } from 'zod';

// Define a schema for user signup
export const signupSchema = z.object({
  username: z.string().min(1, "Username is required"), // Ensure username is provided
  email: z.string()
    .email("Invalid email format") // Ensure it's a valid email
    .min(1, "Email is required"), // Ensure it's not empty
  password: z.string()
    .min(6, "Password must be at least 6 characters long") // Minimum length
    .min(1, "Password is required") // Ensure it's not empty
});

// Define a schema for user signin
export const signinSchema = z.object({
  identifier: z.string()
    .min(1, "Identifier is required"), // Ensure identifier (username or email) is provided
  password: z.string()
    .min(6, "Password must be at least 6 characters long") // Minimum length
    .min(1, "Password is required") // Ensure it's not empty
});

// TypeScript types inferred from the schemas
export type Signup = z.infer<typeof signupSchema>;
export type Signin = z.infer<typeof signinSchema>;
