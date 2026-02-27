CREATE TABLE "game" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"cover" text NOT NULL,
	"genres" text[] NOT NULL,
	"platforms" text[] NOT NULL,
	"release_date" text NOT NULL,
	"developer" text NOT NULL,
	"publisher" text NOT NULL,
	"description" text NOT NULL,
	"storyline" text NOT NULL,
	"features" text[] NOT NULL,
	"screenshots" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_store" (
	"id" text PRIMARY KEY NOT NULL,
	"game_id" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"logo" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_store" ADD CONSTRAINT "game_store_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;