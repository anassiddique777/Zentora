import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// The Prisma CLI (migrations, introspection) needs a direct connection,
// so it uses DIRECT_URL. The runtime client uses the pooled DATABASE_URL
// via a driver adapter — see src/lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
