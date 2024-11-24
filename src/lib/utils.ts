import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Validation schema for authentication forms
export const authFormSchema = (type: "signin" | "signup") =>
  z.object({
    // Shared fields for both signin and signup
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),

    // Fields specific to signup
    ...(type === "signup" && {
      username: z.string().min(3, "Username is required"),
      phoneNumber: z.string().min(10, "Invalid phone number"),
      address: z.string().min(5, "Address is required"),
      role: z.enum(["USER", "ADMIN"], { required_error: "Role is required" }),
    }),
  });
