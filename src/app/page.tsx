import {Button} from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Welcome to CertVault AI
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Smartly manage your certificates and documents with the power of AI.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}