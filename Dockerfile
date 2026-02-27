FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS builder 
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/app/db ./app/db
COPY --from=builder /app/app/data ./app/data
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/drizzle ./drizzle

EXPOSE 3000
CMD ["bun", "run", "start"]