'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  detectAnomalousWaterUsage,
  type DetectAnomalousWaterUsageOutput,
} from '@/ai/flows/detect-anomalous-water-usage';

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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  waterUsageData: z
    .string()
    .min(10, { message: 'Please provide more detailed water usage data.' }),
  expectedUsagePattern: z.string().min(10, {
    message: 'Please provide a more detailed expected usage pattern.',
  }),
  threshold: z.coerce
    .number()
    .min(1, 'Threshold must be at least 1')
    .max(100, 'Threshold cannot be more than 100'),
});

const defaultValues = {
  waterUsageData:
    '{"time": "2024-07-28T10:00:00Z", "usage": 1200}, {"time": "2024-07-28T11:00:00Z", "usage": 1250}, {"time": "2024-07-28T12:00:00Z", "usage": 1800}, {"time": "2024-07-28T13:00:00Z", "usage": 1750}',
  expectedUsagePattern:
    'Normal usage is between 1100-1300 L/hr. Spikes are not expected during midday.',
  threshold: 20,
};

export function AnomalyDetector() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectAnomalousWaterUsageOutput | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await detectAnomalousWaterUsage(values);
      setResult(output);
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description:
          'Failed to run the anomaly detection. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="waterUsageData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water Usage Data (JSON format)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter time-series data of water usage..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a series of JSON objects with 'time' and 'usage' keys.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expectedUsagePattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Usage Pattern</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the expected water usage pattern..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Based on historical data or operational expectations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anomaly Detection Threshold (%)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 20" {...field} />
                </FormControl>
                <FormDescription>
                  Percentage deviation from expected usage to trigger an alert.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Detect Anomalies
          </Button>
        </form>
      </Form>
      {result && (
        <Alert
          variant={result.isAnomalous ? 'destructive' : 'default'}
          className={
            !result.isAnomalous
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : ''
          }
        >
          {result.isAnomalous ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
          )}
          <AlertTitle>
            {result.isAnomalous
              ? 'Anomaly Detected!'
              : 'No Anomaly Detected'}
          </AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{result.anomalyDescription}</p>
            {result.isAnomalous && result.suggestedActions && (
              <div>
                <h4 className="font-semibold">Suggested Actions:</h4>
                <p>{result.suggestedActions}</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
