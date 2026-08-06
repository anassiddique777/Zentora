"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PRIORITY_CONFIG, type TaskPriority } from "@/features/tasks/constants";
import { PRIORITY_CHART_COLORS } from "../constants";

const config = {
  count: { label: "Tasks" },
} satisfies ChartConfig;

export function PriorityBar({
  data,
}: {
  data: { priority: TaskPriority; count: number }[];
}) {
  const chartData = data.map((entry) => ({
    ...entry,
    name: PRIORITY_CONFIG[entry.priority].label,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by priority</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="max-h-64 w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.priority}
                  fill={PRIORITY_CHART_COLORS[entry.priority]}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
