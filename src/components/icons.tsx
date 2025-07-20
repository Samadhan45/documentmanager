import {
  Book,
  Briefcase,
  FileText,
  HeartPulse,
  Landmark,
  Shield,
  Star,
  User,
  type LucideProps,
} from 'lucide-react';
import type {FC} from 'react';

import type {DocumentCategory} from '@/lib/types';

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  google: (props: LucideProps) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.66 1.98-3.55 0-6.43-2.91-6.43-6.48s2.88-6.48 6.43-6.48c2.03 0 3.36.85 4.17 1.62l2.55-2.55C17.06 3.6 15.01 3 12.48 3 7.4 3 3.53 6.62 3.53 11.5s3.87 8.5 8.95 8.5c2.58 0 4.7-1.02 6.2-2.58 1.57-1.57 2.08-3.78 2.08-5.99 0-.48-.05-.96-.12-1.42h-8.6z"
        fill="currentColor"
      />
    </svg>
  ),
};

export const CategoryIcons: Record<
  DocumentCategory,
  FC<React.ComponentProps<'svg'>>
> = {
  Education: Book,
  ID: Shield,
  Medical: HeartPulse,
  Employment: Briefcase,
  Legal: Landmark,
  Financial: Star,
  Personal: User,
  Other: FileText,
};
