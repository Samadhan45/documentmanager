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
import {Download, Copy, Check} from 'lucide-react';
import type {Document} from '@/lib/types';
import {Badge} from './ui/badge';
import React, {useState} from 'react';
import {useToast} from '@/hooks/use-toast';

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

function KeyInfoItem({label, value}: {label: string; value: string}) {
  const [hasCopied, setHasCopied] = useState(false);
  const {toast} = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setHasCopied(true);
    toast({title: 'Copied!', description: `${label} copied to clipboard.`});
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleCopy}>
        {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
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
          <SheetDescription asChild>
            <div>
              <Badge variant="secondary">{document.category}</Badge>
            </div>
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

            {document.keyInfo && document.keyInfo.length > 0 && (
              <div>
                <h3 className="mb-2 text-lg font-semibold">Key Information</h3>
                <div className="space-y-2">
                  {document.keyInfo.map((info, index) => (
                    <KeyInfoItem key={index} label={info.label} value={info.value} />
                  ))}
                </div>
              </div>
            )}

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
