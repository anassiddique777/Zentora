import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function CalendarPage() {
  return (
    <ComingSoon
      icon={CalendarDays}
      title="Calendar — coming soon"
      description="A calendar view of tasks and due dates is planned for an upcoming phase."
    />
  );
}
