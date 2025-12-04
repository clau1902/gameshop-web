import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL || "postgres://biblion:biblion123@localhost:5432/gamevault",
  },
});
