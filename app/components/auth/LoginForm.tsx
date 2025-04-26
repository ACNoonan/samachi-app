'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

// 1. Define Zod Schema
const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { supabase, user, isLoading } = useAuth();

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
      // Let the middleware handle the redirect
      router.refresh(); // Refresh the page to trigger middleware

    } catch (error: any) {
      console.error('Supabase login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={{ 
        background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
        color: 'white' 
      }}
    >
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100" 
              onClick={() => router.back()}
              aria-label="Go back"
              disabled={form.formState.isSubmitting}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold text-blue-800">Samachi Sign In</CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            Access your Samachi membership securely
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        className="bg-white/80 backdrop-blur-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="bg-white/80 backdrop-blur-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium rounded-lg shadow-md transition-colors"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}; 