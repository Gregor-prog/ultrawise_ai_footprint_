import { MaintenancePredictor } from '@/components/gen-ai/maintenance-predictor';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function MaintenancePage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Predictive Maintenance
        </h2>
        <p className="text-muted-foreground">
          AI tool that recommends predictive maintenance based on sensor data
          and historical patterns, preventing downtime.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Predict Maintenance Needs</CardTitle>
          <CardDescription>
            Analyze sensor data to predict potential equipment failures and receive
            maintenance recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MaintenancePredictor />
        </CardContent>
      </Card>
    </div>
  );
}
