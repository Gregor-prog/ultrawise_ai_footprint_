'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type SystemHealth = {
  status: string;
  checks: {
    name: string;
    status: 'ok' | 'error';
  }[];
};

type SystemStatusCardProps = {
  systemHealth: SystemHealth;
};

const statusIcons = {
  ok: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  error: <XCircle className="h-4 w-4 text-destructive" />,
};

export function SystemStatusCard({ systemHealth }: SystemStatusCardProps) {
  const isOk = !systemHealth.checks.some((c) => c.status === 'error');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge
          variant={isOk ? 'secondary' : 'destructive'}
          className={cn(
            'text-sm',
            isOk && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
          )}
        >
          {systemHealth.status}
        </Badge>
        <div className="space-y-2">
          {systemHealth.checks.map((check) => (
            <div
              key={check.name}
              className="flex items-center justify-between text-sm"
            >
              <p className="text-muted-foreground">{check.name}</p>
              <div className="flex items-center gap-2">
                {statusIcons[check.status]}
                <span className="font-medium">
                  {check.status === 'ok' ? 'Operational' : 'Error'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
