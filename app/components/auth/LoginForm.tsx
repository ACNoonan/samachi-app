'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/app/context/AuthContext';
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

// 1. Define Zod Schema
const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useSimpleAuth();

  // 2. Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // 3. Define onSubmit handler using form data
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // isLoading state is now form.formState.isSubmitting
    console.log('Login form submitted:', values);

    try {
      const response = await fetch('/api/login-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Use validated values from react-hook-form
        body: JSON.stringify({ username: values.username, password: values.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      toast.success(data.message || 'Signed in successfully!');
      login(); // Update auth state
      router.push('/dashboard'); // Redirect

    } catch (error: any) {
      console.error('Login API error:', error);
      toast.error(error.message || 'An error occurred during login.');
      // Optionally reset form fields on error if desired
      // form.reset();
    }
    // No need for setIsLoading(false) here, handled by react-hook-form
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
       <button
        onClick={() => router.back()}
        className="self-start mb-8 p-2 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Go back"
        // Disable button during submission
        disabled={form.formState.isSubmitting}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Sign In</h1>
        <p className="text-muted-foreground">Access your Samachi membership</p>
      </div>

      {/* 4. Use Form component */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your_username"
                    autoComplete="username"
                    className="bg-white/50 backdrop-blur-sm border-gray-200"
                    disabled={form.formState.isSubmitting}
                    {...field} // Spread field props (onChange, onBlur, value, ref)
                  />
                </FormControl>
                <FormMessage /> {/* Displays validation errors */}
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
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full glass-button"
            disabled={form.formState.isSubmitting} // Disable based on form state
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