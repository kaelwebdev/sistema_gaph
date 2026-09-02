// Prisma config for CLI commands (Prisma 7)
const { defineConfig } = require("prisma/config");
require("dotenv").config({ path: ".env.local" });

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});