
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from './ui/button';
import {UploadCloud, Loader2} from 'lucide-react';
import React, {useCallback, useState} from 'react';
import {useToast} from '@/hooks/use-toast';

interface UploadDialogProps {
  children: React.ReactNode;
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function UploadDialog({
  children,
  onFileUpload,
  isUploading,
  isOpen,
  setIsOpen,
}: UploadDialogProps) {
  const [dragActive, setDragActive] = useState(false);
  const {toast} = useToast();

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        title: 'Sorry, the file is too large.',
        description: `We can only accept files smaller than ${MAX_FILE_SIZE_MB}MB. Please try a smaller file.`,
        variant: 'destructive',
      });
      return;
    }
    onFileUpload(file);
  };

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onFileUpload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Select a file from your device or drag it here to upload.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <label
            htmlFor="dropzone-file"
            className={`relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              dragActive ? 'border-primary bg-primary/10' : 'border-border'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="font-medium">Processing...</span>
                <span className="text-sm">This may take a moment.</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <UploadCloud className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, PNG, JPG (MAX. {MAX_FILE_SIZE_MB}MB)
                </p>
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}

    