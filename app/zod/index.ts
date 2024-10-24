import { signupSchema, signinSchema } from './zod'; // Adjust the path as needed
import { z } from 'zod';

// Define a type for the validation body
type SignupBody = {
  action: 'signup';
  username: string; // Add other fields based on your signup schema
  email: string;
  password: string;
};

type SigninBody = {
  action: 'signin';
  email: string;
  password: string;
};

type ValidateUserBody = SignupBody | SigninBody;

export async function validateUser(body: ValidateUserBody) {
  try {
    // Determine the action and validate accordingly
    if (body.action === 'signup') {
      signupSchema.parse(body); // This will throw if validation fails
    } else if (body.action === 'signin') {
      signinSchema.parse(body); // This will throw if validation fails
    } else {
      throw new Error('Invalid action');
    }

    // Return true if validation is successful
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return a response with validation errors
      console.log("Validation error:", error);
      return {
        valid: false,
        errors: error.errors
      };
    } else {
      // Handle unexpected errors
      console.log("Unexpected error:", error);
      return {
        valid: false,
        errors: [{ message: 'Unexpected error occurred' }]
      };
    }
  }
}
