// Prisma config for CLI commands (Prisma 7)
import { defineConfig } from "prisma/config";
import "dotenv/config";
import { env } from "@/lib/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env.DIRECT_URL,
    shadowDatabaseUrl: env.SHADOW_DATABASE_URL,
  },
});