import { OptimizationSuggester } from '@/components/gen-ai/optimization-suggester';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function OptimizationsPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Optimizations</h2>
        <p className="text-muted-foreground">
          AI-powered recommendations for optimizing cooling cycles and reducing
          water waste, improving WUE (Water Usage Effectiveness).
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Suggest Cooling Optimizations</CardTitle>
          <CardDescription>
            Provide current data center metrics to receive AI-generated
            strategies for improving efficiency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OptimizationSuggester />
        </CardContent>
      </Card>
    </div>
  );
}
