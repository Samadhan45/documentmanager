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
  documentType: z.string().describe('The type of the document (e.g., Education, ID, Medical).'),
  name: z.string().describe('The name of the person or entity associated with the document.'),
  dateOfIssue: z.string().describe('The date when the document was issued.'),
  expiryDate: z.string().optional().describe('The expiry date of the document, if applicable.'),
  issuingAuthority: z.string().describe('The organization or authority that issued the document.'),
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
  - The type of the document (e.g., Education, ID, Medical).
  - The name of the person or entity associated with the document.
  - The date when the document was issued.
  - The expiry date of the document, if applicable.
  - The organization or authority that issued the document.

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
