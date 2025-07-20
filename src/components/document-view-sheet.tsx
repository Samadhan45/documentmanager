'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {ScrollArea} from './ui/scroll-area';
import {Button} from './ui/button';
import {Download} from 'lucide-react';
import type {Document} from '@/lib/types';
import {Badge} from './ui/badge';

interface DocumentViewSheetProps {
  document: Document | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface MetadataItemProps {
  label: string;
  value?: string;
}

function MetadataItem({label, value}: MetadataItemProps) {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  );
}

export default function DocumentViewSheet({
  document,
  isOpen,
  onOpenChange,
}: DocumentViewSheetProps) {
  if (!document) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="line-clamp-2 pr-8">
            {document.fileName}
          </SheetTitle>
          <SheetDescription>
            <Badge variant="secondary">{document.category}</Badge>
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-6 p-1 pr-6">
            <div className="relative aspect-[8.5/11] w-full overflow-hidden rounded-lg border">
              {document.fileType.startsWith('image/') ? (
                <img
                  src={document.fileUrl}
                  alt={document.fileName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <iframe
                  src={document.fileUrl}
                  className="h-full w-full"
                  title={document.fileName}
                />
              )}
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Summary</h3>
              <p className="text-sm text-muted-foreground">
                {document.metadata.summary}
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <MetadataItem
                  label="Document Type"
                  value={document.metadata.documentType}
                />
                <MetadataItem label="Name" value={document.metadata.name} />
                <MetadataItem
                  label="Date of Issue"
                  value={document.metadata.dateOfIssue}
                />
                <MetadataItem
                  label="Expiry Date"
                  value={document.metadata.expiryDate}
                />
                <MetadataItem
                  label="Issuing Authority"
                  value={document.metadata.issuingAuthority}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <Button className="w-full" asChild>
            <a href={document.fileUrl} download={document.fileName}>
              <Download className="mr-2 h-4 w-4" />
              Download Original
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
