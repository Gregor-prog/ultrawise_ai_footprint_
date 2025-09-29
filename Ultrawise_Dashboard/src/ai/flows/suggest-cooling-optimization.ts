'use server';

/**
 * @fileOverview AI-driven recommendations for optimizing cooling cycles and reducing water waste.
 *
 * - suggestCoolingOptimization - A function that suggests cooling optimization strategies.
 * - SuggestCoolingOptimizationInput - The input type for the suggestCoolingOptimization function.
 * - SuggestCoolingOptimizationOutput - The return type for the suggestCoolingOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCoolingOptimizationInputSchema = z.object({
  currentWUE: z.number().describe('The current Water Usage Effectiveness (WUE) of the data center.'),
  historicalWaterConsumption: z
    .array(z.object({timestamp: z.string(), consumption: z.number()}))
    .describe('Historical water consumption data with timestamps.'),
  currentCoolingCycle: z.string().describe('The current cooling cycle configuration.'),
  itEnergyLoad: z.number().describe('The current IT energy load of the data center.'),
  carbonEmissionsData: z
    .array(z.object({timestamp: z.string(), emissions: z.number()}))
    .describe('Historical carbon emissions data related to cooling.'),
});
export type SuggestCoolingOptimizationInput = z.infer<typeof SuggestCoolingOptimizationInputSchema>;

const SuggestCoolingOptimizationOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of recommendations for optimizing cooling cycles and reducing water waste.'),
  estimatedWUEImprovement: z
    .number()
    .describe('The estimated improvement in WUE after implementing the recommendations.'),
  estimatedWaterSavings: z.number().describe('The estimated water savings after implementing the recommendations.'),
  rationale: z.string().describe('The AI rationale behind the recommendations.'),
});
export type SuggestCoolingOptimizationOutput = z.infer<typeof SuggestCoolingOptimizationOutputSchema>;

export async function suggestCoolingOptimization(input: SuggestCoolingOptimizationInput): Promise<SuggestCoolingOptimizationOutput> {
  return suggestCoolingOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCoolingOptimizationPrompt',
  input: {schema: SuggestCoolingOptimizationInputSchema},
  output: {schema: SuggestCoolingOptimizationOutputSchema},
  prompt: `You are an expert in data center cooling optimization and water management.

  Based on the provided data, provide actionable recommendations for optimizing cooling cycles and reducing water waste in order to improve Water Usage Effectiveness (WUE).

  Current WUE: {{{currentWUE}}}
  Historical Water Consumption: {{#each historicalWaterConsumption}}{{{timestamp}}}: {{{consumption}}}, {{/each}}
  Current Cooling Cycle: {{{currentCoolingCycle}}}
  IT Energy Load: {{{itEnergyLoad}}}
  Carbon Emissions Data: {{#each carbonEmissionsData}}{{{timestamp}}}: {{{emissions}}}, {{/each}}

  Provide specific recommendations, estimate the potential WUE improvement and water savings, and explain the rationale behind your suggestions.
  Be very specific, provide numbers, and be as clear and actionable as possible.`,
});

const suggestCoolingOptimizationFlow = ai.defineFlow(
  {
    name: 'suggestCoolingOptimizationFlow',
    inputSchema: SuggestCoolingOptimizationInputSchema,
    outputSchema: SuggestCoolingOptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
