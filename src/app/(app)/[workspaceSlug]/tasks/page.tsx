import type { Metadata } from "next";
import { ListTodo } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "My Tasks",
};

export default function TasksPage() {
  return (
    <ComingSoon
      icon={ListTodo}
      title="My Tasks — coming soon"
      description="All tasks assigned to you across projects will show up here once tasks land."
    />
  );
}
