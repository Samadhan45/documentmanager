'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import {firebaseApp} from '@/lib/firebase/config';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {Loader2, User} from 'lucide-react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

const auth = getAuth(firebaseApp);

// This is needed to ensure the reCAPTCHA verifier is only created once on the client.
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] =
    useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  useEffect(() => {
    // This effect ensures the reCAPTCHA is rendered on the client side.
    setTimeout(() => {
      if (!window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            'recaptcha-container',
            {
              size: 'invisible',
              callback: (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
              },
            }
          );
        } catch (error) {
          console.error('Recaptcha Verifier error', error);
        }
      }
    }, 100);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Sign-in Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Anonymous Sign-in Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPhoneLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier!;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setVerificationId(confirmationResult);
      setIsCodeSent(true);
      toast({
        title: 'Verification Code Sent',
        description: 'A code has been sent to your phone.',
      });
    } catch (error: any) {
      toast({
        title: 'Phone Sign-in Failed',
        description: error.message,
        variant: 'destructive',
      });
      // Reset reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          // @ts-ignore
          window.grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationId) return;
    setIsPhoneLoading(true);
    try {
      await verificationId.confirm(verificationCode);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Choose your preferred sign-in method below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <form onSubmit={handleSignIn} className="grid gap-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In with Email
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="phone">
            {!isCodeSent ? (
              <form onSubmit={handlePhoneSignIn} className="grid gap-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 123-456-7890"
                    required
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    disabled={isPhoneLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPhoneLoading}
                >
                  {isPhoneLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="grid gap-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    required
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    disabled={isPhoneLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPhoneLoading}
                >
                  {isPhoneLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verify & Sign In
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAnonymousSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <User className="mr-2 h-4 w-4" />
          )}
          Continue as Guest
        </Button>
      </CardContent>
      <div id="recaptcha-container"></div>
    </Card>
  );
}
