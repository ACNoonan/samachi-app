"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useAuth } from "@/app/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/form";

// Define Zod Schema for OTP login (email only)
const otpFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

interface WalletButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  name: string;
}

const WalletButton = ({ icon, name, ...props }: WalletButtonProps) => {
  return (
    <button
      className="relative group/btn flex items-center justify-center px-4 w-full text-white rounded-md font-medium shadow-input"
      type="button"
      {...props}
    >
      {icon && <span className="flex items-center justify-center w-5 h-5 mr-2">{icon}</span>}
      <span className="text-sm">
        {name}
      </span>
      <BottomGradient />
    </button>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const SamachiLoginPage = () => {
  const router = useRouter();
  const { supabase } = useAuth();
  
  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof otpFormSchema>) {
    console.log("OTP Login attempt with:", values.email);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          // No card_identifier for this generic login flow
        },
      });

      if (error) {
        throw error; 
      }

      toast.success("Check your email!", { description: "We\'ve sent a magic link to your email address."});
      // Don't redirect here, user needs to click the email link.
      // router.refresh(); // Not needed here, callback will handle session and redirect
    } catch (error: any) {
      console.error("Supabase OTP login error:", error);
      toast.error(
        error.message || "Login failed. Please try again."
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-lg bg-black/95 backdrop-blur-sm text-white">
          <CardHeader className="space-y-1">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="p-0 h-auto text-white hover:text-gray-300 hover:bg-gray-900"
                onClick={() => router.back()}
                disabled={form.formState.isSubmitting}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-1 text-sm">Back</span>
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Samachi Sign In</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email to receive a magic link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-gray-300 font-medium">Email Address</Label>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            className="pl-10 bg-gray-900/80 backdrop-blur-sm border-gray-800 focus:border-gray-700 focus:ring focus:ring-gray-700 text-white"
                            disabled={form.formState.isSubmitting}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 font-medium rounded-lg shadow-md transition-colors"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Sending Link..." : "Send Magic Link"}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-400">
                  Or connect with
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <WalletButton
                name="Connect Solana Wallet"
                onClick={() => {
                  toast("Solana wallet authentication coming soon!", {
                    style: { 
                      background: 'rgba(30, 30, 30, 0.9)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(75, 75, 75, 0.5)'
                    }
                  });
                }}
                className="bg-gray-900 text-white border border-gray-800 hover:bg-gray-800 w-full justify-center h-11 rounded-lg"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pt-0">
            <div className="text-center text-sm">
              <span className="text-gray-400">Need an account for a card?</span>{" "}
              <Link 
                href="/card/SOME_DEFAULT_OR_EXAMPLE_CARD_ID" // Or guide to scan a card
                className="text-gray-300 hover:text-white hover:underline font-medium"
              >
                Register your card
              </Link>
            </div>
             <div className="text-center text-sm mt-2">
                <span className="text-gray-400">No card? Use</span>{" "}
                <Link href="/minimal-login" className="text-gray-300 hover:text-white hover:underline font-medium">
                    Demo Login (No Card)
                </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SamachiLoginPage; 