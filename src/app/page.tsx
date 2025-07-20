'use client';

import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {motion} from 'framer-motion';
import Image from 'next/image';
import {Icons} from '@/components/icons';

export default function Home() {
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const imageVariants = {
    hidden: {x: 100, opacity: 0},
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        delay: 0.4,
      },
    },
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <motion.div
        className="grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <motion.div variants={itemVariants}>
            <Icons.logo className="mb-4 h-16 w-16 text-primary" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl"
            variants={itemVariants}
          >
            Welcome to <span className="text-primary">CertVault AI</span>
          </motion.h1>
          <motion.p
            className="mt-4 max-w-md text-lg text-muted-foreground"
            variants={itemVariants}
          >
            Smartly manage your certificates and documents with the power of AI.
            Secure, intelligent, and always accessible.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            variants={itemVariants}
          >
            <Button asChild size="lg">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          className="relative hidden h-full w-full md:block"
          variants={imageVariants}
        >
          <Image
            src="https://placehold.co/600x400.png"
            alt="Digital vault illustration"
            width={600}
            height={400}
            className="rounded-xl object-cover shadow-2xl"
            data-ai-hint="digital vault abstract"
          />
        </motion.div>
      </motion.div>
    </main>
  );
}