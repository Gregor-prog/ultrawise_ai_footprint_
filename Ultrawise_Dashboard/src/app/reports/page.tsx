'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { WaterUsageChart } from '@/components/dashboard/water-usage-chart';
import { SystemStatusCard } from '@/components/dashboard/system-status-card';
import { systemHealth } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const { toast } = useToast();

  const handlePrint = () => {
    // In a real app, this would generate a more sophisticated report.
    // For now, we'll just use the browser's print functionality.
    toast({
      title: 'Generating Report',
      description: 'Preparing the report for printing.',
    });
    window.print();
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Generate reports on water consumption, carbon footprint, and
            optimization insights.
          </p>
        </div>
        <Button onClick={handlePrint} className="hidden md:flex">
          <Printer className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div
        className="space-y-4"
        // Simple way to make this section printable
        id="report-content"
      >
        <Card>
          <CardHeader>
            <CardTitle>Weekly Water Consumption Summary</CardTitle>
            <CardDescription>
              An overview of water usage over the last 7 days compared to your
              set goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <WaterUsageChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health Report</CardTitle>
            <CardDescription>
              A snapshot of the current operational status of all monitored
              systems.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SystemStatusCard systemHealth={systemHealth} />
          </CardContent>
        </Card>

         <Button onClick={handlePrint} className="w-full md:hidden">
          <Printer className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #report-content,
          #report-content * {
            visibility: visible;
          }
          #report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
