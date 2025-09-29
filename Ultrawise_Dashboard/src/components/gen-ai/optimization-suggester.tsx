'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  suggestCoolingOptimization,
  type SuggestCoolingOptimizationOutput,
} from '@/ai/flows/suggest-cooling-optimization';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  Lightbulb,
  Droplets,
  TrendingUp,
  BrainCircuit,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  currentWUE: z.coerce.number().positive('Current WUE must be positive.'),
  currentCoolingCycle: z.string().min(5, 'Cooling cycle info is required.'),
  itEnergyLoad: z.coerce.number().positive('IT Energy Load must be positive.'),
  historicalWaterConsumption: z
    .string()
    .min(10, 'Historical consumption data is required.'),
  carbonEmissionsData: z
    .string()
    .min(10, 'Carbon emissions data is required.'),
});

const defaultValues = {
  currentWUE: 1.51,
  currentCoolingCycle: 'Standard evaporative cooling, 4 cycles of concentration.',
  itEnergyLoad: 500, // kW
  historicalWaterConsumption:
    'Average 5,400 m³/day, with peaks during afternoon hours.',
  carbonEmissionsData: 'Average 2.5 tCO2e/day from cooling energy.',
};

// Helper to parse string data into the required array format for the AI flow
const parseStringToArray = (input: string, valueKey: string) => {
    // This is a mock parser. A real implementation would parse structured data.
    return [{ timestamp: new Date().toISOString(), [valueKey]: parseFloat(input) || 0 }];
}

export function OptimizationSuggester() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<SuggestCoolingOptimizationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      // The AI flow expects array inputs, but we're taking strings for simplicity.
      // A real app would have more robust data handling.
      const flowInput = {
        ...values,
        historicalWaterConsumption: parseStringToArray(values.historicalWaterConsumption, "consumption"),
        carbonEmissionsData: parseStringToArray(values.carbonEmissionsData, "emissions"),
      };
      
      const output = await suggestCoolingOptimization(flowInput);
      setResult(output);
    } catch (error) {
      console.error('Error suggesting optimizations:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description:
          'Failed to generate optimization suggestions. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
             <FormField
              control={form.control}
              name="currentWUE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current WUE (L/kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="itEnergyLoad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IT Energy Load (kW)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="currentCoolingCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Cooling Cycle</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <div className="md:col-span-2">
             <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Recommendations
              </Button>
           </div>
        </form>
      </Form>
      {result && (
        <div className="space-y-6 pt-4">
          <div className="grid gap-4 md:grid-cols-3">
             <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-muted-foreground"><TrendingUp className="mr-2"/>Est. WUE Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">+{result.estimatedWUEImprovement.toFixed(2)}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-muted-foreground"><Droplets className="mr-2"/>Est. Water Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{result.estimatedWaterSavings.toLocaleString()} L/day</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Lightbulb className="mr-2 text-accent"/>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-1 shrink-0"/>
                        <span>{rec}</span>
                    </li>
                ))}
              </ul>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><BrainCircuit className="mr-2"/>Rationale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{result.rationale}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
