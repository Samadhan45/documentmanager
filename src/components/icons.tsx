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
