'use client';

import {motion} from 'framer-motion';
import {format, parseISO} from 'date-fns';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import type {Document} from '@/lib/types';
import {CategoryIcons} from './icons';

interface DocumentCardProps {
  document: Document;
  onSelect: (document: Document) => void;
}

export default function DocumentCard({document, onSelect}: DocumentCardProps) {
  const Icon = CategoryIcons[document.category] || CategoryIcons.Other;
  return (
    <motion.div
      layout
      initial={{opacity: 0, scale: 0.9}}
      animate={{opacity: 1, scale: 1}}
      exit={{opacity: 0, scale: 0.9}}
      transition={{type: 'spring', stiffness: 300, damping: 25}}
      className="h-full"
    >
      <Card
        className="flex h-full cursor-pointer flex-col overflow-hidden border-border/80 bg-card transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
        onClick={() => onSelect(document)}
      >
        <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-end p-4 pt-0">
          <p
            className="line-clamp-2 text-sm font-semibold leading-tight text-card-foreground"
            title={document.fileName}
          >
            {document.fileName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {format(parseISO(document.createdAt), 'MMM d, yyyy')}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
