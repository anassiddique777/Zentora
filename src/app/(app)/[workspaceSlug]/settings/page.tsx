import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Settings — coming soon"
      description="Workspace settings, members, and roles will be managed here in an upcoming phase."
    />
  );
}
