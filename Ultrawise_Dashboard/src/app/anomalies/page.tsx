import { AnomalyDetector } from '@/components/gen-ai/anomaly-detector';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function AnomalyDetectionPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Anomaly Detection
        </h2>
        <p className="text-muted-foreground">
          Use AI to identify leaks, evaporation losses, and cooling
          inefficiencies from water usage data.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Analyze Water Usage</CardTitle>
          <CardDescription>
            Input parameters and run the AI model to detect anomalous water
            usage patterns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnomalyDetector />
        </CardContent>
      </Card>
    </div>
  );
}
