'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  predictMaintenanceNeeds,
  type PredictMaintenanceNeedsOutput,
} from '@/ai/flows/predict-maintenance-needs';

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
import { Loader2, AlertCircle, ShieldAlert, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  sensorData: z.string().min(10, 'Sensor data is required.'),
  historicalData: z.string().min(10, 'Historical data is required.'),
  systemInfo: z.string().min(10, 'System information is required.'),
});

const defaultValues = {
  sensorData:
    '{"temperature": 45, "pressure": 3.5, "vibration": 0.8, "flow_rate": 1150}',
  historicalData:
    'Vibration levels have increased by 15% over the last 48 hours. Temperature has been fluctuating more than usual.',
  systemInfo:
    'Cooling Pump 3B, in service for 3 years. Last serviced 6 months ago. Rated for 1500 L/min flow.',
};

export function MaintenancePredictor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictMaintenanceNeedsOutput | null>(
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
      const output = await predictMaintenanceNeeds(values);
      setResult(output);
    } catch (error) {
      console.error('Error predicting maintenance:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description:
          'Failed to run the maintenance prediction. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="sensorData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Real-time Sensor Data</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter sensor data in JSON format..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="historicalData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical Data / Trends</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe historical patterns..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="systemInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Information</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the system or component..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Predict Needs
          </Button>
        </form>
      </Form>
      {result && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgency</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={getUrgencyBadge(result.urgency)} className="text-lg">
                {result.urgency}
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prediction</CardTitle>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm">{result.prediction}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recommended Actions
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm">{result.recommendedActions}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
