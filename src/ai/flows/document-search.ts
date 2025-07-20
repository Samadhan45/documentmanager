// src/ai/flows/document-search.ts
'use server';

/**
 * @fileOverview Document search flow that allows users to search for documents using natural language questions.
 *
 * - documentSearch - A function that handles the document search process.
 * - DocumentSearchInput - The input type for the documentSearch function.
 * - DocumentSearchOutput - The return type for the documentSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentSearchInputSchema = z.object({
  query: z.string().describe('The natural language question to search for documents.'),
  documentSummaries: z.array(
    z.object({
      documentId: z.string().describe('The ID of the document.'),
      summary: z.string().describe('The summary of the document content.'),
    })
  ).describe('An array of document summaries to search through.'),
});

export type DocumentSearchInput = z.infer<typeof DocumentSearchInputSchema>;

const DocumentSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      documentId: z.string().describe('The ID of the matching document.'),
      relevanceScore: z.number().describe('The relevance score of the document to the query.'),
    })
  ).describe('An array of search results with document IDs and relevance scores.'),
});

export type DocumentSearchOutput = z.infer<typeof DocumentSearchOutputSchema>;

export async function documentSearch(input: DocumentSearchInput): Promise<DocumentSearchOutput> {
  return documentSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentSearchPrompt',
  input: {schema: DocumentSearchInputSchema},
  output: {schema: DocumentSearchOutputSchema},
  prompt: `You are an AI document search assistant. Given a user's query and a list of document summaries, find the documents that are most relevant to the query.

  Query: {{{query}}}

  Document Summaries:
  {{#each documentSummaries}}
  - Document ID: {{this.documentId}}, Summary: {{this.summary}}
  {{/each}}

  Return a JSON array of search results, where each result contains the document ID and a relevance score between 0 and 1. The relevance score indicates how relevant the document is to the query.  A score of 1 indicates perfect relevance, and a score of 0 indicates no relevance. Sort the results by relevance score in descending order.
  Ensure the output is a valid JSON.
  `,
});

const documentSearchFlow = ai.defineFlow(
  {
    name: 'documentSearchFlow',
    inputSchema: DocumentSearchInputSchema,
    outputSchema: DocumentSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
