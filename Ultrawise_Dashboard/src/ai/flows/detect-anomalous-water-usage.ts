'use server';
/**
 * @fileOverview Detects anomalous water usage patterns in data centers using AI.
 *
 * - detectAnomalousWaterUsage - A function that detects anomalous water usage.
 * - DetectAnomalousWaterUsageInput - The input type for the detectAnomalousWaterUsage function.
 * - DetectAnomalousWaterUsageOutput - The return type for the detectAnomalousWaterUsage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomalousWaterUsageInputSchema = z.object({
  waterUsageData: z.string().describe('Time-series data of water usage in the data center.'),
  expectedUsagePattern: z.string().describe('Expected water usage pattern based on historical data.'),
  threshold: z.number().describe('Threshold for anomaly detection (e.g., percentage deviation from expected usage).'),
});
export type DetectAnomalousWaterUsageInput = z.infer<typeof DetectAnomalousWaterUsageInputSchema>;

const DetectAnomalousWaterUsageOutputSchema = z.object({
  isAnomalous: z.boolean().describe('Whether anomalous water usage is detected.'),
  anomalyDescription: z.string().describe('Description of the anomaly, if any.'),
  suggestedActions: z.string().describe('Suggested actions to address the anomaly.'),
});
export type DetectAnomalousWaterUsageOutput = z.infer<typeof DetectAnomalousWaterUsageOutputSchema>;

export async function detectAnomalousWaterUsage(input: DetectAnomalousWaterUsageInput): Promise<DetectAnomalousWaterUsageOutput> {
  return detectAnomalousWaterUsageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomalousWaterUsagePrompt',
  input: {schema: DetectAnomalousWaterUsageInputSchema},
  output: {schema: DetectAnomalousWaterUsageOutputSchema},
  prompt: `You are an expert in data center water usage analysis.

You will analyze water usage data to detect anomalies, comparing it with expected patterns and a defined threshold.

Based on the analysis, determine if there is anomalous water usage. If yes, describe the anomaly and suggest actions.

Water Usage Data: {{{waterUsageData}}}
Expected Usage Pattern: {{{expectedUsagePattern}}}
Anomaly Detection Threshold: {{{threshold}}}%

Consider factors like leaks, evaporation losses, and cooling inefficiencies.

Respond in the following structure:
{
  "isAnomalous": true/false,
  "anomalyDescription": "Description of the anomaly",
  "suggestedActions": "Suggested actions to address the anomaly"
}`,
});

const detectAnomalousWaterUsageFlow = ai.defineFlow(
  {
    name: 'detectAnomalousWaterUsageFlow',
    inputSchema: DetectAnomalousWaterUsageInputSchema,
    outputSchema: DetectAnomalousWaterUsageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
