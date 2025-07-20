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
      initial={{opacity: 0, scale: 0.8}}
      animate={{opacity: 1, scale: 1}}
      exit={{opacity: 0, scale: 0.8}}
      transition={{type: 'spring', stiffness: 300, damping: 30}}
      className="h-full"
    >
      <Card
        className="flex h-full cursor-pointer flex-col transition-all hover:shadow-lg hover:-translate-y-1"
        onClick={() => onSelect(document)}
      >
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(document.createdAt), 'MMM d, yyyy')}
          </p>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-end">
          <p
            className="line-clamp-2 text-sm font-medium"
            title={document.fileName}
          >
            {document.fileName}
          </p>
          <p className="text-xs text-muted-foreground">{document.category}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
