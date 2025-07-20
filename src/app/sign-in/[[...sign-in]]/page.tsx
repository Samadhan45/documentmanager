import Link from 'next/link';
import Script from 'next/script';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
          <CardContent className="flex flex-col items-center gap-4">
            <div
              id="g_id_onload"
              data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
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
            <Link href="/dashboard" className="text-sm text-primary hover:underline mt-4">
              Proceed to Dashboard (after sign-in)
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
