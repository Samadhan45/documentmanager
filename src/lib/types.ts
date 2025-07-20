export const CATEGORIES = [
  'Education',
  'ID',
  'Medical',
  'Employment',
  'Legal',
  'Financial',
  'Personal',
  'Other',
] as const;

export type DocumentCategory = (typeof CATEGORIES)[number];

export interface DocumentMetadata {
  summary: string;
  documentType: string;
  name: string;
  dateOfIssue: string;
  expiryDate?: string;
  issuingAuthority: string;
}

export interface KeyInfo {
  label: string;
  value: string;
}

export interface Document {
  id: string;
  fileName: string;
  fileUrl: string; // data URL for local-first
  fileType: string;
  category: DocumentCategory;
  metadata: DocumentMetadata;
  keyInfo: KeyInfo[];
  createdAt: string;
}
