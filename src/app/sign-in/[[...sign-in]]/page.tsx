
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {Icons} from '@/components/icons';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    (window as any).handleGoogleCredentialResponse = (response: any) => {
      console.log('Encoded JWT ID token: ' + response.credential);
      // For now, we'll just redirect to the dashboard on successful sign-in
      // In a real app, you would verify the token on your backend
      router.push('/dashboard');
    };

    return () => {
      document.body.removeChild(script);
      delete (window as any).handleGoogleCredentialResponse;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your CertVault AI dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form action="/dashboard" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div
              id="g_id_onload"
              data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
              data-callback="handleGoogleCredentialResponse"
              data-context="signin"
              data-ux_mode="popup"
              data-auto_select="false"
              data-itp_support="false"
            ></div>

            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left"
            ></div>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/dashboard">Continue as Guest</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?&nbsp;
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
