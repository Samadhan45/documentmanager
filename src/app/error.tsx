
'use client';

import {Button} from '@/components/ui/button';
import {RotateCcw} from 'lucide-react';
import {useEffect} from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tighter text-destructive sm:text-5xl md:text-6xl">
          Oops! Something went wrong.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          We're very sorry about this. An unexpected error occurred. Please try
          restarting the application.
        </p>
        <Button onClick={() => reset()} size="lg">
          <RotateCcw className="mr-2" />
          Restart App
        </Button>
      </div>
    </main>
  );
}
