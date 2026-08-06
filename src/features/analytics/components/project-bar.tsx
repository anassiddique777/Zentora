"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
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

const config = {
  count: { label: "Tasks" },
} satisfies ChartConfig;

export function ProjectBar({
  data,
}: {
  data: { name: string; color: string; count: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks per project</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="w-full"
          style={{ height: Math.max(data.length * 44, 120) }}
        >
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <XAxis type="number" hide allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={110}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
