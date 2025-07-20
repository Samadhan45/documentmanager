import { config } from 'dotenv';
config();

import '@/ai/flows/auto-categorize-documents.ts';
import '@/ai/flows/document-search.ts';
import '@/ai/flows/summarize-and-extract-metadata.ts';
import '@/ai/flows/extract-key-info.ts';
