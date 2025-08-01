'use client';

import {AnimatePresence} from 'framer-motion';
import {FileSearch, Bot, Loader2} from 'lucide-react';
import type {Document} from '@/lib/types';
import {Skeleton} from './ui/skeleton';
import DocumentCard from './document-card';

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  isSearching: boolean;
  onSelectDocument: (document: Document) => void;
  searchQuery: string;
}

function SkeletonCard() {
  return (
    <div className="flex h-full flex-col rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export default function DocumentList({
  documents,
  isLoading,
  isSearching,
  onSelectDocument,
  searchQuery,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({length: 10}).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  
  if (isSearching) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-xl font-semibold">Searching...</h3>
          <p className="text-muted-foreground">
            The AI is looking through your documents.
          </p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    if (searchQuery) {
       return (
         <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed">
           <Bot className="h-16 w-16 text-muted-foreground" />
           <div className="text-center">
             <h3 className="text-xl font-semibold">No Results Found</h3>
             <p className="text-muted-foreground">
               The AI couldn't find any documents matching your query.
             </p>
           </div>
         </div>
       );
    }
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed">
        <FileSearch className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-xl font-semibold">No Documents Found</h3>
          <p className="text-muted-foreground">
            Try uploading a new document to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <AnimatePresence>
        {documents.map(doc => (
          <DocumentCard key={doc.id} document={doc} onSelect={onSelectDocument} />
        ))}
      </AnimatePresence>
    </div>
  );
}
