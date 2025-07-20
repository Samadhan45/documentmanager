import Link from 'next/link';
import Script from 'next/script';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SignInPage() {
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async />
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your CertVault AI dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign In with Email
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                <span className="bg-card px-2 text-center text-sm text-muted-foreground flex justify-center">OR</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
               <div
                id="g_id_onload"
                data-client_id="857692423877-bfps7cvj31d11p17s1qamo4ubr3sursa.apps.googleusercontent.com"
                data-login_uri="/dashboard"
                data-auto_prompt="false"
              ></div>
              <div
                className="g_id_signin"
                data-type="standard"
                data-size="large"
                data-theme="outline"
                data-text="sign_in_with"
                data-shape="rectangular"
                data-logo_alignment="left"
              ></div>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/dashboard">Continue as Guest</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
