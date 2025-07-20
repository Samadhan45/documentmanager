'use server';
/**
 * @fileOverview Automatically categorizes documents based on their content.
 *
 * - autoCategorizeDocuments - A function that handles the document categorization process.
 * - AutoCategorizeDocumentsInput - The input type for the autoCategorizeDocuments function.
 * - AutoCategorizeDocumentsOutput - The return type for the autoCategorizeDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoCategorizeDocumentsInputSchema = z.object({
  documentText: z.string().describe('The text content of the document.'),
});
export type AutoCategorizeDocumentsInput = z.infer<
  typeof AutoCategorizeDocumentsInputSchema
>;

const AutoCategorizeDocumentsOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The predicted category of the document (e.g., Education, ID, Medical, Employment).'
    ),
  confidence: z
    .number()
    .describe(
      'A confidence score between 0 and 1 indicating the certainty of the categorization.'
    ),
});
export type AutoCategorizeDocumentsOutput = z.infer<
  typeof AutoCategorizeDocumentsOutputSchema
>;

export async function autoCategorizeDocuments(
  input: AutoCategorizeDocumentsInput
): Promise<AutoCategorizeDocumentsOutput> {
  return autoCategorizeDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoCategorizeDocumentsPrompt',
  input: {schema: AutoCategorizeDocumentsInputSchema},
  output: {schema: AutoCategorizeDocumentsOutputSchema},
  prompt: `You are an expert document categorization AI.

  Given the text content of a document, predict its category. Return a confidence score indicating how sure you are of the prediction.

  The possible categories are: Education, ID, Medical, Employment, Legal, Financial, Personal, Other.

  Document Text: {{{documentText}}}

  Ensure that the output is valid JSON.
  `,
});

const autoCategorizeDocumentsFlow = ai.defineFlow(
  {
    name: 'autoCategorizeDocumentsFlow',
    inputSchema: AutoCategorizeDocumentsInputSchema,
    outputSchema: AutoCategorizeDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
