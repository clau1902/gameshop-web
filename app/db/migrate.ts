import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgres://biblion:biblion123@localhost:5432/gamevault";

export async function runMigrations() {
  console.log("🔄 Running database migrations...");
  
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);
  
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await migrationClient.end();
  }
}

