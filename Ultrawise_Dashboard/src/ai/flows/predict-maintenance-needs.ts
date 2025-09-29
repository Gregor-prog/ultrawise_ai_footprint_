'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting data center maintenance needs based on sensor data and historical patterns.
 *
 * The flow takes sensor data as input and returns a prediction of maintenance needs, including recommended actions and urgency.
 *
 * @exports predictMaintenanceNeeds - The main function to trigger the maintenance prediction flow.
 * @exports PredictMaintenanceNeedsInput - The input type for the predictMaintenanceNeeds function.
 * @exports PredictMaintenanceNeedsOutput - The output type for the predictMaintenanceNeeds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the predictMaintenanceNeeds flow.
 */
const PredictMaintenanceNeedsInputSchema = z.object({
  sensorData: z.string().describe('Real-time sensor data in JSON format, including water level, flow rate, temperature, and pressure.'),
  historicalData: z.string().describe('Historical sensor data in JSON format, including timestamps and corresponding sensor readings.'),
  systemInfo: z.string().describe('Data center system information, including cooling system type, capacity, and maintenance history.')
});
export type PredictMaintenanceNeedsInput = z.infer<typeof PredictMaintenanceNeedsInputSchema>;

/**
 * Output schema for the predictMaintenanceNeeds flow.
 */
const PredictMaintenanceNeedsOutputSchema = z.object({
  prediction: z.string().describe('Predicted maintenance needs based on sensor data and historical patterns.'),
  recommendedActions: z.string().describe('Recommended maintenance actions to prevent downtime.'),
  urgency: z.string().describe('Urgency of the recommended maintenance actions (e.g., low, medium, high).'),
});
export type PredictMaintenanceNeedsOutput = z.infer<typeof PredictMaintenanceNeedsOutputSchema>;

/**
 * Main function to trigger the maintenance prediction flow.
 * @param input - The input data for the flow.
 * @returns A promise that resolves to the maintenance prediction output.
 */
export async function predictMaintenanceNeeds(input: PredictMaintenanceNeedsInput): Promise<PredictMaintenanceNeedsOutput> {
  return predictMaintenanceNeedsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictMaintenanceNeedsPrompt',
  input: {schema: PredictMaintenanceNeedsInputSchema},
  output: {schema: PredictMaintenanceNeedsOutputSchema},
  prompt: `You are an expert data center maintenance advisor.

  Analyze the sensor data, historical data, and system information to predict potential maintenance needs.
  Recommend actions to prevent downtime and indicate the urgency of the actions.

  Sensor Data: {{{sensorData}}}
  Historical Data: {{{historicalData}}}
  System Information: {{{systemInfo}}}

  Provide your prediction, recommended actions, and urgency in the output.
  `,
});

const predictMaintenanceNeedsFlow = ai.defineFlow(
  {
    name: 'predictMaintenanceNeedsFlow',
    inputSchema: PredictMaintenanceNeedsInputSchema,
    outputSchema: PredictMaintenanceNeedsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
