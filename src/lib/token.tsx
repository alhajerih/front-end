"use server";

import { jwtDecode } from "jwt-decode"; // Ensure the type for jwtDecode is available
import { cookies } from "next/headers";

// Define the decoded JWT type (adjust based on your token structure)
interface DecodedToken {
  exp: number;
  [key: string]: any; // Add other fields if necessary
}

// Set the token in cookies
export async function setToken(token: string): Promise<void> {
  const cookieStore = cookies();
  (await cookieStore).set("token", token);
}

// Get the token from cookies
export async function getToken(): Promise<string | undefined> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  return token;
}

// Delete the token from cookies
export async function deleteToken(): Promise<void> {
  const cookieStore = cookies();
  (await cookieStore).delete("token");
}

// Decode and return the user from the token
export async function getUser(): Promise<DecodedToken | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const user: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (user.exp < currentTime) {
      await deleteToken();
      return null;
    }

    return user;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
