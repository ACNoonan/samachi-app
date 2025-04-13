'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/app/context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useSimpleAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username || !password) {
      toast.error('Username and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/login-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
       <button
        onClick={() => router.back()}
        className="self-start mb-8 p-2 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Sign In</h1>
        <p className="text-muted-foreground">Access your Samachi membership</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_username"
            required
            disabled={isLoading}
            className="bg-white/50 backdrop-blur-sm border-gray-200"
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            className="bg-white/50 backdrop-blur-sm border-gray-200"
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          className="w-full glass-button"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Link to create profile if they landed here by mistake? Or is CardLanding the only entry? */}
        {/* For MVP, maybe omit this link if flow is strictly Card -> Create or Card -> Login */}
        {/* <p className="text-center text-sm">
          Don't have an account? You need a membership card to sign up.
          <Link href="/" className="text-primary font-medium hover:underline"> Learn More</Link> 
        </p> */}
      </form>
    </div>
  );
}; 