'use client';

import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {motion} from 'framer-motion';
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <motion.div
        className="flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Icons.logo className="mb-4 h-24 w-24 text-primary" />
        </motion.div>
        <motion.h1
          className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl"
          variants={itemVariants}
        >
          Welcome to <span className="text-primary">CertVault AI</span>
        </motion.h1>
        <motion.p
          className="mt-4 max-w-xl text-lg text-muted-foreground"
          variants={itemVariants}
        >
          Smartly manage your certificates and documents with the power of AI.
          Secure, intelligent, and always accessible on your device.
        </motion.p>
        <motion.div
          className="mt-8 flex flex-col gap-4 sm:flex-row"
          variants={itemVariants}
        >
          <Button asChild size="lg">
            <Link href="/dashboard">Continue as Guest</Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
