'use server';
/**
 * @fileOverview AI flow for summarizing document content and extracting key metadata.
 *
 * - summarizeAndExtractMetadata - Function to summarize and extract metadata from a document.
 * - SummarizeAndExtractMetadataInput - Input type for the summarizeAndExtractMetadata function.
 * - SummarizeAndExtractMetadataOutput - Return type for the summarizeAndExtractMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAndExtractMetadataInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeAndExtractMetadataInput = z.infer<typeof SummarizeAndExtractMetadataInputSchema>;

const SummarizeAndExtractMetadataOutputSchema = z.object({
  summary: z.string().describe('A short summary of the document content.'),
  documentType: z.string().describe('The type of the document (e.g., Resume, Invoice, Medical Record).'),
  name: z.string().describe('The full name of the person or entity associated with the document.'),
  location: z.string().optional().describe('The city and state, or country, mentioned in the document.'),
  issuingAuthority: z.string().optional().describe('The organization or authority that issued the document (e.g., company name for a resume, university for a diploma).'),
});
export type SummarizeAndExtractMetadataOutput = z.infer<typeof SummarizeAndExtractMetadataOutputSchema>;

export async function summarizeAndExtractMetadata(input: SummarizeAndExtractMetadataInput): Promise<SummarizeAndExtractMetadataOutput> {
  return summarizeAndExtractMetadataFlow(input);
}

const summarizeAndExtractMetadataPrompt = ai.definePrompt({
  name: 'summarizeAndExtractMetadataPrompt',
  input: {schema: SummarizeAndExtractMetadataInputSchema},
  output: {schema: SummarizeAndExtractMetadataOutputSchema},
  prompt: `You are an AI assistant that summarizes documents and extracts key metadata.

  Analyze the document provided and extract the following information:
  - A short summary of the document content.
  - The type of the document (e.g., Resume, ID, Medical).
  - The name of the person or entity associated with the document.
  - The location (e.g., "San Francisco, CA") if present.
  - The organization or authority that issued the document (e.g., the company name on a resume).

  Do not extract dates like "date of issue" or "expiry date" unless they are part of the core document content.

  Document: {{media url=documentDataUri}}
  `,
});

const summarizeAndExtractMetadataFlow = ai.defineFlow(
  {
    name: 'summarizeAndExtractMetadataFlow',
    inputSchema: SummarizeAndExtractMetadataInputSchema,
    outputSchema: SummarizeAndExtractMetadataOutputSchema,
  },
  async input => {
    const {output} = await summarizeAndExtractMetadataPrompt(input);
    return output!;
  }
);
