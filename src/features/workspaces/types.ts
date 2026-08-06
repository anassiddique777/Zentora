export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export type MemberRow = {
  id: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
};
