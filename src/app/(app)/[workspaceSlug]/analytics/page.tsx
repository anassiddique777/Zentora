import type { Metadata } from "next";
import { ChartNoAxesColumn } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AnalyticsPage() {
  return (
    <ComingSoon
      icon={ChartNoAxesColumn}
      title="Analytics — coming soon"
      description="Project and team productivity insights are planned for an upcoming phase."
    />
  );
}
