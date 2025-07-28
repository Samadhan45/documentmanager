
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  Loader2,
  Plus,
  Search,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import {AboutDialog} from './about-dialog';

type SearchResult = {
  documentId: string;
  relevanceScore: number;
};

const STORAGE_KEY = 'certvault-ai-documents';
// In-memory map to store blob URLs, as they are session-specific and cannot be stringified.
const blobUrlMap = new Map<string, string>();

const sampleDocument: Document = {
  id: 'sample-resume-1',
  fileName: 'John_Doe_Resume.png',
  fileUrl: 'https://placehold.co/850x1100.png',
  fileType: 'image/png',
  category: 'Employment',
  metadata: {
    summary:
      'A highly skilled and motivated professional with experience in software development and project management. Proven ability to lead teams and deliver high-quality products on time and within budget. Seeking to leverage technical expertise and leadership skills in a challenging new role.',
    documentType: 'Resume',
    name: 'John Doe',
    location: 'San Francisco, CA',
    issuingAuthority: 'Self-published',
  },
  keyInfo: [
    {label: 'Email', value: 'john.doe@example.com'},
    {label: 'Phone', value: '123-456-7890'},
    {label: 'Website', value: 'johndoe.dev'},
    {label: 'LinkedIn', value: 'linkedin.com/in/johndoe'},
    {
      label: 'Primary Skills',
      value: 'React, Node.js, TypeScript, Project Management',
    },
  ],
  createdAt: new Date().toISOString(),
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
    setIsLoading(true);
    try {
      const storedDocs = localStorage.getItem(STORAGE_KEY);
      if (storedDocs && JSON.parse(storedDocs).length > 0) {
        const parsedDocs: Document[] = JSON.parse(storedDocs);
        // We restore blob URLs from the in-memory map if they exist for the session.
        const hydratedDocs = parsedDocs.map(doc => {
          if (blobUrlMap.has(doc.id)) {
            return { ...doc, fileUrl: blobUrlMap.get(doc.id)! };
          }
          return doc;
        });
        setDocuments(hydratedDocs);
      } else {
        setDocuments([sampleDocument]);
      }
    } catch (error) {
      console.error('Failed to parse documents from localStorage', error);
      setDocuments([sampleDocument]); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect runs whenever documents change to update localStorage.
    if (!isLoading) {
      try {
        const isSampleOnly =
          documents.length === 1 && documents[0].id === 'sample-resume-1';

        // Prepare docs for storage by removing blob URLs.
        const docsToStore = documents.map(doc => {
          const { fileUrl, ...rest } = doc;
          // Only store docs that don't have a blob URL (i.e., the sample doc)
          // or store the doc without the fileUrl if it's a blob.
          if (doc.fileUrl.startsWith('blob:')) {
            return rest;
          }
          return doc;
        });
        
        if (!isSampleOnly && documents.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(docsToStore));
        } else {
          // If only sample doc is left or no docs, clear storage.
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to save documents to localStorage', error);
        toast({
          title: "We're very sorry about this.",
          description:
            'We encountered an issue saving your documents. Please try again.',
          variant: 'destructive',
        });
      }
    }
  }, [documents, isLoading, toast]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const performSearch = async () => {
      if (documents.length === 0) {
        return;
      }
      setIsSearching(true);
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
          title: 'Sorry, Search Failed',
          description:
            'We encountered an issue with the AI search. Please try again.',
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

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadDialogOpen(false);

      try {
        const dataUri = await fileToDataUri(file);

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
        
        const fileUrl = URL.createObjectURL(file);
        const docId = crypto.randomUUID();
        blobUrlMap.set(docId, fileUrl); // Store blob URL in memory

        const newDocument: Document = {
          id: docId,
          fileName: file.name,
          fileUrl: fileUrl, // Use blob URL for preview in the current session
          fileType: file.type,
          category: CATEGORIES.find(c => c === category) || ('Other' as const),
          metadata,
          keyInfo,
          createdAt: new Date().toISOString(),
        };

        setDocuments(prev => {
          const isSample =
            prev.length === 1 && prev[0].id === 'sample-resume-1';
          return isSample ? [newDocument] : [newDocument, ...prev];
        });

        toast({
          title: 'Upload Successful',
          description: `${file.name} has been processed and saved.`,
        });
      } catch (error) {
        console.error('AI processing failed:', error);
        toast({
          title: 'We are sorry, the upload failed.',
          description:
            'We encountered an error processing your document with AI. Please try again.',
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
      const docToDelete = documents.find(doc => doc.id === documentId);
      if (docToDelete && docToDelete.fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(docToDelete.fileUrl); // Clean up blob URL from memory
        blobUrlMap.delete(documentId);
      }
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setActiveDocument(null);
      toast({
        title: 'Document Deleted',
        description: 'The document has been successfully deleted.',
      });
    },
    [documents, toast]
  );

  const handleResetData = () => {
    // Clear all blob URLs from memory
    documents.forEach(doc => {
      if (doc.fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(doc.fileUrl);
      }
    });
    blobUrlMap.clear();
    localStorage.removeItem(STORAGE_KEY);
    setDocuments([sampleDocument]);
    toast({
      title: 'Data Cleared',
      description: 'All local documents have been removed.',
    });
  };

  const filteredDocuments = useMemo(() => {
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
      docs = docs.filter(doc => rankedDocs.has(doc.id));
    } else if (searchQuery && documents.length > 0 && !isSearching) {
      return [];
    } else if (searchQuery && isSearching) {
      return [];
    }

    return docs.filter(
      doc => activeCategory === 'All' || doc.category === activeCategory
    );
  }, [
    documents,
    activeCategory,
    searchQuery,
    searchResults,
    isSearching,
  ]);

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
          <SidebarFooter>
            <AboutDialog />
          </SidebarFooter>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <RotateCcw />
                    <span className="sr-only">Reset Data</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      all your uploaded documents from this browser and restore
                      the sample document.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetData}>
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

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
