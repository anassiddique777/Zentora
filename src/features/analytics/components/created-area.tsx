"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  count: { label: "Tasks created", color: "#3b82f6" },
} satisfies ChartConfig;

function formatTick(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function CreatedArea({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks created — last 30 days</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="max-h-64 w-full">
          <AreaChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              minTickGap={32}
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatTick(String(value))}
                />
              }
            />
            <Area
              dataKey="count"
              type="monotone"
              fill="var(--color-count)"
              fillOpacity={0.15}
              stroke="var(--color-count)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
