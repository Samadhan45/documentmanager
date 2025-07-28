
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from './ui/button';
import {Info} from 'lucide-react';
import {ScrollArea} from './ui/scroll-area';
import {Badge} from './ui/badge';

const InfoSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <h3 className="font-semibold text-lg text-foreground">{title}</h3>
    <div className="text-sm text-muted-foreground space-y-2">{children}</div>
  </div>
);

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-primary hover:text-sidebar-primary bg-primary/20 hover:bg-primary/30 ring-2 ring-primary/50 animate-pulse-slow shadow-lg shadow-primary/30"
        >
          <Info className="mr-2" />
          <span>About this App</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>About CertVault AI</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="space-y-6 text-sm text-muted-foreground">
            <InfoSection title="Project Overview">
              <p>
                CertVault AI is an intelligent document management application
                built with Next.js and Google's Gemini AI. It allows users to
                upload, categorize, and search for documents using natural
                language. The app leverages AI to automatically extract key
                information, summarize content, and assign relevant categories,
                making document organization effortless.
              </p>
            </InfoSection>

            <InfoSection title="How to Use">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Upload Documents:</strong> Click the "Upload" button
                  to select a file. The AI will process it, extracting metadata
                  and categorizing it automatically.
                </li>
                <li>
                  <strong>View Documents:</strong> Click on any document card to
                  see its details, AI-generated summary, and extracted key info.
                </li>
                <li>
                  <strong>Filter by Category:</strong> Use the sidebar menu to
                  filter documents by category.
                </li>
                <li>
                  <strong>Natural Language Search:</strong> Use the search bar to
                  ask questions about your documents (e.g., "Which document is my
                  resume?" or "Find my medical records").
                </li>
                <li>
                  <strong>Reset Data:</strong> The "Reset" button clears all
                  documents from your browser's local storage and restores the
                  initial sample document.
                </li>
              </ul>
            </InfoSection>

            <InfoSection title="Current Limitations">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Local Storage Only:</strong> All documents are stored
                  in your browser's local storage and are not persisted in a
                  cloud database. Clearing your browser data will remove them.
                </li>
                <li>
                  <strong>File Size Limit:</strong> There is a 5MB limit per
                  file to ensure application performance.
                </li>
                <li>
                  <strong>No User Accounts:</strong> The app currently operates in
                  a "guest mode" without user authentication or accounts.
                </li>
                <li>
                  <strong>Limited File Previews:</strong> Previews for all file
                  types will open in a new tab for reliability.
                </li>
              </ul>
            </InfoSection>

            <InfoSection title="Work in Progress">
              <p>Future development plans include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Secure cloud storage with user accounts (Firebase Auth &
                  Storage).
                </li>
                <li>Advanced AI features like document comparison.</li>
                <li>Enhanced sharing and collaboration capabilities.</li>
              </ul>
            </InfoSection>

            <InfoSection title="Developer Information">
              <div className="flex flex-col space-y-1">
                <p className="font-semibold text-card-foreground">
                  Samadhan Vilas Kadam
                </p>
                <p>Java Full Stack Developer</p>
                <div className="flex gap-2 pt-1">
                  <a href="https://github.com/Samadhan45" target="_blank" rel="noopener noreferrer">
                    <Badge variant="secondary">GitHub</Badge>
                  </a>
                  <a href="https://linkedin.com/in/samadhan1" target="_blank" rel="noopener noreferrer">
                    <Badge variant="secondary">LinkedIn</Badge>
                  </a>
                  <a href="https://samadhan-zeta.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <Badge variant="secondary">Portfolio</Badge>
                  </a>
                </div>
              </div>
            </InfoSection>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
