// Prisma config for CLI commands
// This file helps with `prisma migrate` and `prisma generate` commands
// For runtime, the database URL comes from the DATABASE_URL env variable

import "dotenv/config";

export default {
  earlyAccess: true,
  schema: "prisma/schema.prisma",
};
