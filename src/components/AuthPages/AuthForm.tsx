"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/app/api/actions/auth";

const authFormSchema = (type: string) =>
  z.object({
    username: z.string().min(1, "Username is required"),
    ...(type !== "signin" && {
      email: z.string().email("Invalid email address"),
    }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // ...(type === "signup"
    //   ? {

    //       role: z.enum(["USER", "ADMIN"], {
    //         required_error: "Role is required",
    //       }),
    //     }
    //   : {}),
  });

// Define types for form data
type AuthFormData = z.infer<ReturnType<typeof authFormSchema>>;

const AuthForm = ({ type }: { type: "signin" | "signup" }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "", // Ensuring a string default
      // Ensuring a string default
      // Ensuring a string default
      // Default role for signup
      ...(type !== "signin" && { email: "" }), // Include email only if type is not "signin"
      password: "",
    },
  });
  type SignUpData = {
    username: string;
    email: string;
    // // phoneNumber: any; // Use any if you're unsure, but refine later
    // address: any;
    password: string;
    // role: any;
  };

  // 2. Define a submit handler
  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);

    try {
      if (type === "signup") {
        const userData: SignUpData = {
          username: data.username,
          email: data.email,
          // phoneNumber: data.phoneNumber || "", // Ensuring phoneNumber is always present
          // address: data.address || "", // Ensuring address is always present
          password: data.password,
          // role: data.role || "USER", // Default role fallback
        };

        await signUp(userData);
        router.push("/signin");
      }

      if (type === "signin") {
        const response = await signIn({
          username: data.username,
          password: data.password,
        });

        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <header className="flex flex-col gap-5 md:gap-8">
          <Link href="/" className="cursor-pointer flex items-center gap-2">
            <Image src={"/logo.svg"} width={34} height={34} alt="Liwan logo" />
            <h1
              className="text-[26px] leading-[32px]
 font-ibm-plex-serif font-bold text-white"
            >
              Tadbeer Financial
            </h1>
          </Link>

          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-[24px] lg:text-[36px] leading-[44px] font-semibold text-white">
              {type === "signin" ? "Sign In" : "Sign Up"}
            </h1>
            <p className="text-[16px] leading-[24px] font-normal text-gray-200">
              {type === "signin"
                ? "Please enter your credentials"
                : "Please fill in your details"}
            </p>
          </div>
        </header>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {type === "signup" && (
              <>
                <CustomInput
                  control={form.control}
                  name="username"
                  label="Username"
                  placeholder="Enter your username"
                />
                <CustomInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                />
                {/* <CustomInput
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="Enter your address"
                /> */}
                {/* <div className="flex gap-4">
                  <CustomInput
                    control={form.control}
                    name="role"
                    label="Role"
                    as="select"
                    options={[
                      { label: "User", value: "USER" },
                      { label: "Admin", value: "ADMIN" },
                    ]}
                  />
                </div> */}
              </>
            )}
            {type === "signin" && (
              <CustomInput
                control={form.control}
                name="username"
                label="Username"
                placeholder="Enter your username"
              />
            )}
            <CustomInput
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="text-[16px] leading-[24px] rounded-lg border border-bankGradient bg-bank-gradient font-semibold text-white shadow-form"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Loading...
                  </>
                ) : type === "signin" ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>

        <footer className="flex justify-center gap-1">
          <p className="text-[14px] leading-[20px] font-normal text-gray-200">
            {type === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={type === "signin" ? "/signup" : "/signin"}
            className="font-medium text-blue-500 hover:underline"
          >
            {type === "signin" ? "Sign up" : "Sign in"}
          </Link>
        </footer>
      </div>
    </section>
  );
};

export default AuthForm;
