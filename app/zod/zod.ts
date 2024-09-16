// zod.ts

import { z } from 'zod';

// Define a schema for validating the user object
export const userSchema = z.object({
  email: z.string()
    .email("Invalid email format") // Ensure it's a valid email
    .min(1, "Email is required"), // Ensure it's not empty
  password: z.string()
    .min(6, "Password must be at least 6 characters long") // Minimum length
    .min(1, "Password is required"), // Ensure it's not empty
});

// TypeScript type inferred from the schema
export type User = z.infer<typeof userSchema>;
