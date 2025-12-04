import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// PostgreSQL connection
const connectionString = process.env.POSTGRES_URL || "postgres://biblion:biblion123@localhost:5432/gamevault";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export { schema };
