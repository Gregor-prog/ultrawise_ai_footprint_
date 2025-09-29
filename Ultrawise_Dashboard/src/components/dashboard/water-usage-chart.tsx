'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { historicalWaterData } from '@/lib/data';

const chartConfig = {
  consumption: {
    label: 'Consumption (m³)',
    color: 'hsl(var(--chart-1))',
  },
  goal: {
    label: 'Goal (m³)',
    color: 'hsl(var(--chart-2))',
  },
};

export function WaterUsageChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={historicalWaterData}
        margin={{
          top: 20,
          left: 12,
          right: 12,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={40}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Legend content={<ChartLegendContent />} />
        <Line
          dataKey="consumption"
          type="monotone"
          stroke="var(--color-consumption)"
          strokeWidth={2}
          dot={true}
        />
        <Line
          dataKey="goal"
          type="monotone"
          stroke="var(--color-goal)"
          strokeWidth={2}
          strokeDasharray="3 3"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
