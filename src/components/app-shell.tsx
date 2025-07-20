'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Book,
  File,
  Home,
  Plus,
  Search,
  Settings,
  Shield,
} from 'lucide-react';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {ThemeToggleButton} from './theme-toggle-button';
import {Icons, CategoryIcons} from './icons';
import type {Document, DocumentCategory} from '@/lib/types';
import {CATEGORIES} from '@/lib/types';
import DocumentList from './document-list';
import {UploadDialog} from './upload-dialog';
import {useToast} from '@/hooks/use-toast';
import {
  autoCategorizeDocuments,
  type AutoCategorizeDocumentsInput,
} from '@/ai/flows/auto-categorize-documents';
import {
  summarizeAndExtractMetadata,
  type SummarizeAndExtractMetadataInput,
} from '@/ai/flows/summarize-and-extract-metadata';
import {
  extractKeyInfo,
  type ExtractKeyInfoInput,
} from '@/ai/flows/extract-key-info';
import DocumentViewSheet from './document-view-sheet';

const STORAGE_KEY = 'certvault-ai-documents';

export default function AppShell() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] =
    useState<DocumentCategory | 'All'>('All');
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);

  const {toast} = useToast();

  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem(STORAGE_KEY);
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      }
    } catch (error) {
      console.error('Failed to parse documents from localStorage', error);
      toast({
        title: 'Error',
        description: 'Could not load your saved documents.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
      } catch (error) {
        console.error('Failed to save documents to localStorage', error);
      }
    }
  }, [documents, isLoading]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadDialogOpen(false);

      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const dataUri = reader.result as string;

          const metadataInput: SummarizeAndExtractMetadataInput = {
            documentDataUri: dataUri,
          };
          const metadata = await summarizeAndExtractMetadata(metadataInput);

          const categorizationInput: AutoCategorizeDocumentsInput = {
            documentText: metadata.summary,
          };
          const {category} = await autoCategorizeDocuments(categorizationInput);

          const keyInfoInput: ExtractKeyInfoInput = {
            documentText: metadata.summary,
          };
          const {keyInfo} = await extractKeyInfo(keyInfoInput);

          const newDocument: Document = {
            id: crypto.randomUUID(),
            fileName: file.name,
            fileUrl: dataUri,
            fileType: file.type,
            category:
              CATEGORIES.find(c => c === category) || ('Other' as const),
            metadata,
            keyInfo,
            createdAt: new Date().toISOString(),
          };

          setDocuments(prev => [newDocument, ...prev]);
          toast({
            title: 'Upload Successful',
            description: `${file.name} has been processed and saved.`,
          });
        };

        reader.onerror = error => {
          throw new Error('File could not be read.');
        };
      } catch (error) {
        console.error('AI processing failed:', error);
        toast({
          title: 'Upload Failed',
          description:
            'There was an error processing your document with AI. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [toast]
  );

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesCategory =
        activeCategory === 'All' || doc.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.metadata.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [documents, activeCategory, searchQuery]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
                <a href="#">
                  <Icons.logo className="size-6 text-primary" />
                </a>
              </Button>
              <div className="flex flex-col">
                <h2 className="text-base font-semibold">CertVault AI</h2>
                <p className="text-xs text-muted-foreground">
                  Smart Document Manager
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveCategory('All')}
                  isActive={activeCategory === 'All'}
                  tooltip="All Documents"
                >
                  <Home />
                  <span>All Documents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {CATEGORIES.map(category => {
                const Icon = CategoryIcons[category];
                return (
                  <SidebarMenuItem key={category}>
                    <SidebarMenuButton
                      onClick={() => setActiveCategory(category)}
                      isActive={activeCategory === category}
                      tooltip={category}
                    >
                      <Icon />
                      <span>{category}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <div className="relative hidden w-full max-w-sm md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UploadDialog
                onFileUpload={handleFileUpload}
                isUploading={isUploading}
                isOpen={isUploadDialogOpen}
                setIsOpen={setUploadDialogOpen}
              >
                <Button>
                  <Plus className="mr-2" />
                  Upload
                </Button>
              </UploadDialog>
              <ThemeToggleButton />
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">{activeCategory}</h1>
              <div className="relative block w-full max-w-sm md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <DocumentList
              documents={filteredDocuments}
              isLoading={isLoading || isUploading}
              onSelectDocument={doc => setActiveDocument(doc)}
            />
          </main>
        </SidebarInset>
      </div>
      <DocumentViewSheet
        document={activeDocument}
        isOpen={!!activeDocument}
        onOpenChange={() => setActiveDocument(null)}
      />
    </SidebarProvider>
  );
}
