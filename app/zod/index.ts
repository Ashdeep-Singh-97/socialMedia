import { NextRequest, NextResponse } from 'next/server';
import { userSchema } from './zod'; // Adjust the path as needed
import { z } from 'zod';

export async function validateUser(body : any) {
  try {
    // Parse and validate the request body
    userSchema.parse(body); // This will throw if validation fails

    // Return true if validation is successful
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return a response with validation errors
      console.log("index.ts : 16", error);
      return {
        valid: false,
        errors: error.errors
      };
    } else {
      // Handle unexpected errors
      console.log("index.ts : 23", error);
      return {
        valid: false,
        errors: [{ message: 'Unexpected error occurred' }]
      };
    }
  }
}
