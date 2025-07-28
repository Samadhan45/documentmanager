'use server';
/**
 * @fileOverview AI flow for extracting key information from a document.
 *
 * - extractKeyInfo - Function to extract key info from a document's text.
 * - ExtractKeyInfoInput - The input type for the extractKeyInfo function.
 * - ExtractKeyInfoOutput - The return type for the extractKeyInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractKeyInfoInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to analyze.'),
});
export type ExtractKeyInfoInput = z.infer<typeof ExtractKeyInfoInputSchema>;

const ExtractKeyInfoOutputSchema = z.object({
  keyInfo: z
    .array(
      z.object({
        label: z
          .string()
          .describe(
            'A descriptive label for the extracted information (e.g., "Email", "Phone", "Website").'
          ),
        value: z
          .string()
          .describe(
            'The extracted value from the document (e.g., "john.doe@email.com", "(123) 456-7890", "johndoe.dev").'
          ),
      })
    )
    .describe(
      'An array of key-value pairs of important information found in the document.'
    ),
});
export type ExtractKeyInfoOutput = z.infer<typeof ExtractKeyInfoOutputSchema>;

export async function extractKeyInfo(
  input: ExtractKeyInfoInput
): Promise<ExtractKeyInfoOutput> {
  return extractKeyInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractKeyInfoPrompt',
  input: {schema: ExtractKeyInfoInputSchema},
  output: {schema: ExtractKeyInfoOutputSchema},
  prompt: `You are an AI assistant that extracts key information from documents.

  Analyze the document text provided and identify important contact information, identifiers, and critical data points. For each piece of information, create a clear, concise label and extract the corresponding value.

  Examples of information to extract:
  - Email Address
  - Phone Number
  - Website or Portfolio URL
  - LinkedIn Profile
  - Account Number
  - Member ID
  - Policy Number

  Document Text:
  {{{documentText}}}
  `,
});

const extractKeyInfoFlow = ai.defineFlow(
  {
    name: 'extractKeyInfoFlow',
    inputSchema: ExtractKeyInfoInputSchema,
    outputSchema: ExtractKeyInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
