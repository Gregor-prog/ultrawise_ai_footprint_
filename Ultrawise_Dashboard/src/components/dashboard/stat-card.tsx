import type { ElementType } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StatCardProps = {
  title: string;
  number:number
  value: string;
  icon: ElementType;
  description?: string;
};

export function StatCard({
  title,
  number,
  value,
  icon: Icon,
  description,
}: StatCardProps) {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      {number == 0? <p className='text-2xl font-bold text-primary'>loading...</p>:       <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>}
    </Card>
  );
}
