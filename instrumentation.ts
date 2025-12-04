export async function register() {
  // Only run migrations on the server side
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runMigrations } = await import("./app/db/migrate");
    
    try {
      await runMigrations();
    } catch (error) {
      console.error("Failed to run migrations on startup:", error);
      // Don't throw - let the app start even if migrations fail
      // This prevents boot loops in production
    }
  }
}

