"use client";

import { Cell, Pie, PieChart } from "recharts";
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
import { STATUS_CONFIG, type TaskStatus } from "@/features/tasks/constants";
import { STATUS_CHART_COLORS } from "../constants";

const config = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([status, { label }]) => [
    status,
    { label, color: STATUS_CHART_COLORS[status as TaskStatus] },
  ]),
) satisfies ChartConfig;

export function StatusDonut({
  data,
  total,
}: {
  data: { status: TaskStatus; count: number }[];
  total: number;
}) {
  const chartData = data.map((entry) => ({
    ...entry,
    name: STATUS_CONFIG[entry.status].label,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square max-h-56">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              innerRadius={55}
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_CHART_COLORS[entry.status]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {chartData.map((entry) => (
            <span
              key={entry.status}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                aria-hidden
                className="size-2 rounded-full"
                style={{ backgroundColor: STATUS_CHART_COLORS[entry.status] }}
              />
              {entry.name} ({entry.count})
            </span>
          ))}
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {total} total {total === 1 ? "task" : "tasks"}
        </p>
      </CardContent>
    </Card>
  );
}
