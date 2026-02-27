import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { game, gameStore } from "../app/db/schema";
import { GAMES } from "../app/data/games";

const client = postgres(process.env.POSTGRES_URL || "postgres://biblion:biblion123@localhost:5432/gamevault");
const db = drizzle(client);

async function seed() {
  console.log("Seeding games...");

  for (const g of GAMES) {
    await db.insert(game).values({
      id: g.id,
      title: g.title,
      cover: g.cover,
      genres: g.genres,
      platforms: g.platforms,
      releaseDate: g.releaseDate,
      developer: g.developer,
      publisher: g.publisher,
      description: g.description,
      storyline: g.storyline,
      features: g.features,
      screenshots: g.screenshots,
    }).onConflictDoNothing();

    for (const store of g.stores) {
      await db.insert(gameStore).values({
        id: `${g.id}-${store.name.toLowerCase().replace(/\s+/g, "-")}`,
        gameId: g.id,
        name: store.name,
        url: store.url,
        price: store.price.toString(),
        logo: store.logo,
      }).onConflictDoNothing();
    }
  }

  console.log(`Seeded ${GAMES.length} games.`);
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
