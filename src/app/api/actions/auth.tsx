"use server";

import { redirect } from "next/navigation";
import { baseUrl, getHeaders } from "./config"; // Define base URL and getHeaders for API requests
import { setToken, deleteToken } from "@/lib/token"; // Token management
import { z } from "zod"; // For validation
import { revalidatePath } from "next/cache"; // For cache revalidation

// Define interfaces for data structures
interface SignUpData {
  username: string;
  email: string;
  // phoneNumber: string;
  // address: string;
  password: string;
  // role: "USER" | "ADMIN";
}

interface LoginData {
  username: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  token: string;
}

interface Beneficiary {
  id: number;
  name: string;
  doesNeedGroceries: boolean;
  groceriesMultiplier: number;
}

interface Saving {
  id: number;
  name: string;
  amount: number;
  // deadline: number;
  // amountAllocatedPerMonth: number;
  icon: string;
}

export interface Transaction {
  id: number;
  amount: number;
  date: string;
  message: string;
  transactionType: "DEPOSIT" | "WITHDRAWAL";
  transactionCategory:
    | "FOOD_GROCERY"
    | "OTHER_GROCERY"
    | "PERSONAL"
    | "EATING_OUT"
    | "ENTERTAINMENT"
    | "TRANSPORTATION"
    | "SUBSCRIPTION"
    | "FIXED_EXPENSE"
    | "ONE_TIME_EXPENSE"
    | "OTHER";
}

// Auth-related actions
export async function signUp(data: SignUpData): Promise<{ message: string }> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to sign up");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
}

export async function signIn(credentials: LoginData): Promise<User> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    console.log(response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to log in");
    }

    const user = await response.json();
    await setToken(user.token); // Save the token for authentication
    return user;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  await deleteToken();
  redirect(`/signin`);
}

// Fetch profile
export async function getProfile(): Promise<User> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/user/me`, {
      method: "GET",
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || "Failed to fetch profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

// Beneficiaries actions
export async function getBeneficiaries(): Promise<Beneficiary[]> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/user/beneficiaries`, {
      method: "GET",
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch beneficiaries");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching beneficiaries:", error);
    throw error;
  }
}

export async function addBeneficiary(
  data: Omit<Beneficiary, "id">
): Promise<Beneficiary> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/user/beneficiaries`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add beneficiary");
    }

    revalidatePath("/beneficiaries");
    return await response.json();
  } catch (error) {
    console.error("Error adding beneficiary:", error);
    throw error;
  }
}

// Savings actions
export async function getSavings(): Promise<Saving[]> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/user/savings`, {
      method: "GET",
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch savings");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching savings:", error);
    throw error;
  }
}

export async function addSaving(data: Omit<Saving, "id">): Promise<Saving> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/user/savings`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    console.log(response, data);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    // revalidatePath("/savings");
    return await response.json();
  } catch (error) {
    console.error("Error adding saving:", error);
    throw error;
  }
}

export async function updateSavingAmount(
  id: number,
  amountToAdd: number
): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/user/savings/${id}`, {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify({ amountToAdd }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update saving amount");
    }
  } catch (error) {
    console.error("Error updating saving amount:", error);
    throw error;
  }
}

export async function deleteSaving(id: number): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/user/savings/${id}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete saving");
    }

    revalidatePath("/savings"); // Revalidate the savings path if needed
  } catch (error) {
    console.error("Error deleting saving:", error);
    throw error;
  }
}

export async function setFavoriteSaving(savingId: number): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/user/savings/${savingId}`, {
      method: "POST", // Use POST as per the backend
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to set favorite saving");
    }
  } catch (error) {
    console.error("Error setting favorite saving:", error);
    throw error;
  }
}

// Transaction actions
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/user/transactions`, {
      method: "GET",
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch transactions");
    }

    const data = await response.json();

    // Map backend fields to camelCase
    return data.map((item: any) => ({
      id: item.id,
      amount: item.amount,
      date: item.dateTime,
      message: item.message,
      transactionType: item.transactionType,
      transactionCategory: item.transactionCategory,
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

// export async function addTransaction(
//   data: Omit<Transaction, "id">
// ): Promise<Transaction> {
//   try {
//     const response = await fetch(`${baseUrl}/api/v1/transactions`, {
//       method: "POST",
//       headers: await getHeaders(),
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to add transaction");
//     }

//     revalidatePath("/transactions");
//     return await response.json();
//   } catch (error) {
//     console.error("Error adding transaction:", error);
//     throw error;
//   }
// }
