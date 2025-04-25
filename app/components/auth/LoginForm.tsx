'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import Link from 'next/link';

// 1. Define Zod Schema
const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { supabase } = useAuth();

  // 2. Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 3. Define onSubmit handler using Supabase auth
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Login attempt with:', values.email);

    try {
      // Use Supabase client to sign in
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error; // Throw Supabase error
      }

      toast.success('Signed in successfully!');
      // No need to call login() from context anymore
      // Redirect is handled by middleware or can be done explicitly
      router.push('/dashboard'); // Or router.refresh() if middleware handles redirect

    } catch (error: any) {
      console.error('Supabase login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
    // isSubmitting is handled by react-hook-form
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
       <button
        onClick={() => router.back()}
        className="self-start mb-8 p-2 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Go back"
        disabled={form.formState.isSubmitting}
      >
        <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Sign In</h1>
        <p className="text-muted-foreground">Access your Samachi membership</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="bg-white/50 backdrop-blur-sm border-gray-200"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="bg-white/50 backdrop-blur-sm border-gray-200"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div className="text-right">
                  <Link href="/forgot-password"
                    className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full glass-button"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Comments remain the same */}
          {/* Link to create profile if they landed here by mistake? Or is CardLanding the only entry? */}
          {/* For MVP, maybe omit this link if flow is strictly Card -> Create or Card -> Login */}
          {/* <p className="text-center text-sm">
            Don't have an account? You need a membership card to sign up.
            <Link href="/" className="text-primary font-medium hover:underline"> Learn More</Link> 
          </p> */}
        </form>
      </Form>
    </div>
  );
}; 