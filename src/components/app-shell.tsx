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
import {Home, Loader2, Plus, Search, LogOut} from 'lucide-react';
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
import {
  documentSearch,
  type DocumentSearchInput,
} from '@/ai/flows/document-search';
import DocumentViewSheet from './document-view-sheet';
import Link from 'next/link';

type SearchResult = {
  documentId: string;
  relevanceScore: number;
};

const STORAGE_KEY = 'certvault-ai-documents';

const sampleDocument: Document = {
  id: 'sample-doc-1',
  fileName: 'Sample University Diploma.png',
  fileUrl: 'https://storage.googleapis.com/fsm-media-fe-prod/1/9/19e95977-99e6-42f2-8c9a-41f238b77626.webp',
  fileType: 'image/png',
  category: 'Education',
  metadata: {
    summary:
      'This is a sample university diploma for Alex Doe from the University of Innovation, awarded on May 15, 2023. It represents a Bachelor of Science in Artificial Intelligence.',
    documentType: 'Diploma',
    name: 'Alex Doe',
    dateOfIssue: '2023-05-15',
    issuingAuthority: 'University of Innovation',
  },
  keyInfo: [
    {label: 'Student ID', value: 'UOI-12345'},
    {label: 'Degree', value: 'Bachelor of Science'},
    {label: 'Major', value: 'Artificial Intelligence'},
  ],
  createdAt: new Date('2023-05-15T10:00:00Z').toISOString(),
};

export default function AppShell() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeCategory, setActiveCategory] =
    useState<DocumentCategory | 'All'>('All');
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);

  const {toast} = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedDocs = localStorage.getItem(STORAGE_KEY);
        if (storedDocs && JSON.parse(storedDocs).length > 0) {
          setDocuments(JSON.parse(storedDocs));
        } else {
          // If no documents are in storage, load the sample one.
          setDocuments([sampleDocument]);
        }
      } catch (error) {
        console.error('Failed to parse documents from localStorage', error);
        setDocuments([sampleDocument]); // Load sample on error as well
        toast({
          title: 'Error',
          description: 'Could not load your saved documents.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!isLoading) {
      try {
        // We only save to local storage if it's not the initial sample document
        const isSample =
          documents.length === 1 && documents[0].id === 'sample-doc-1';
        if (!isSample) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
        }
      } catch (error) {
        console.error('Failed to save documents to localStorage', error);
      }
    }
  }, [documents, isLoading]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      if (documents.length === 0) {
        setIsSearching(false);
        return;
      }
      try {
        const input: DocumentSearchInput = {
          query: searchQuery,
          documentSummaries: documents.map(doc => ({
            documentId: doc.id,
            summary: doc.metadata.summary,
          })),
        };
        const {results} = await documentSearch(input);
        setSearchResults(results);
      } catch (error) {
        console.error('AI search failed:', error);
        toast({
          title: 'Search Failed',
          description:
            'The AI search could not be completed. Please try again.',
          variant: 'destructive',
        });
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const handler = setTimeout(performSearch, 500); // Debounce search

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, documents, toast]);

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
          
          // If the only document is the sample one, replace it. Otherwise, add to the list.
          setDocuments(prev => {
            const isSample =
              prev.length === 1 && prev[0].id === 'sample-doc-1';
            return isSample ? [newDocument] : [newDocument, ...prev];
          });
          
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

  const handleDeleteDocument = useCallback(
    (documentId: string) => {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setActiveDocument(null);
      toast({
        title: 'Document Deleted',
        description: 'The document has been successfully deleted.',
      });
    },
    [toast]
  );

  const filteredDocuments = useMemo(() => {
    // If we're still doing the initial load, return an empty array
    if (isLoading) {
      return [];
    }

    let docs = documents;

    if (searchQuery && searchResults.length > 0) {
      const rankedDocs = new Map(
        searchResults.map((res, index) => [res.documentId, index])
      );
      docs = [...documents].sort((a, b) => {
        const rankA = rankedDocs.get(a.id);
        const rankB = rankedDocs.get(b.id);
        if (rankA === undefined && rankB === undefined) return 0;
        if (rankA === undefined) return 1;
        if (rankB === undefined) return -1;
        return rankA - rankB;
      });
      // Filter out documents that are not in the search results
      docs = docs.filter(doc => rankedDocs.has(doc.id));
    } else if (searchQuery && documents.length > 0 && !isSearching) {
      // If there's a search query but no results (and we're not actively searching), it means no matches.
      return [];
    } else if (searchQuery && isSearching) {
      // While actively searching, don't show any documents until results come back.
      return [];
    }

    return docs.filter(
      doc => activeCategory === 'All' || doc.category === activeCategory
    );
  }, [documents, activeCategory, searchQuery, searchResults, isLoading, isSearching]);

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
              <div className="relative hidden w-full max-w-sm items-center md:flex">
                <Search className="absolute left-3 text-muted-foreground" />
                {isSearching && (
                  <Loader2 className="absolute right-3 animate-spin" />
                )}
                <Input
                  placeholder="Ask about your documents..."
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
              <Button variant="outline" size="icon" asChild>
                <Link href="/">
                  <LogOut />
                  <span className="sr-only">Log out</span>
                </Link>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">{activeCategory}</h1>
              <div className="relative flex w-full max-w-sm items-center md:hidden">
                <Search className="absolute left-3 text-muted-foreground" />
                {isSearching && (
                  <Loader2 className="absolute right-3 animate-spin" />
                )}
                <Input
                  placeholder="Ask about your documents..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <DocumentList
              documents={filteredDocuments}
              isLoading={isLoading || isUploading}
              isSearching={isSearching && !!searchQuery}
              onSelectDocument={doc => setActiveDocument(doc)}
              searchQuery={searchQuery}
            />
          </main>
        </SidebarInset>
      </div>
      <DocumentViewSheet
        document={activeDocument}
        isOpen={!!activeDocument}
        onOpenChange={() => setActiveDocument(null)}
        onDelete={handleDeleteDocument}
      />
    </SidebarProvider>
  );
}
